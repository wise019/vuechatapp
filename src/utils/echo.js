import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import store from '@/store'
import { Toast } from 'vant'
import i18n from '@/i18n'

// 设置Pusher为Echo的广播驱动
window.Pusher = Pusher

let echoInstance = null

/**
 * Echo WebSocket连接管理
 */
export default {
  /**
   * 初始化Echo连接
   */
  run() {
    try {
      // 获取用户认证信息
      const authUser = localStorage.getItem('authUser')
      if (!authUser) {
        console.warn(
          'User not logged in, cannot establish WebSocket connection'
        )
        return
      }

      const userData = JSON.parse(authUser)
      if (!userData.access_token) {
        console.warn(
          'Access token missing, cannot establish WebSocket connection'
        )
        return
      }

      // 创建Echo实例
      echoInstance = new Echo({
        broadcaster: 'pusher',
        key: process.env.VUE_APP_PUSHER_APP_KEY || 'your-pusher-key',
        cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER || 'ap3',
        wsHost: process.env.VUE_APP_WEBSOCKET_HOST || window.location.hostname,
        wsPort: process.env.VUE_APP_WEBSOCKET_PORT || 6001,
        forceTLS: process.env.VUE_APP_PUSHER_FORCE_TLS || false,
        encrypted: true,
        auth: {
          headers: {
            Authorization: `Bearer ${userData.access_token}`,
          },
        },
      })

      // 监听连接事件
      echoInstance.connector.pusher.connection.bind('connected', () => {
        console.log('WebSocket connected')
        this.setupChannels()
      })

      echoInstance.connector.pusher.connection.bind('disconnected', () => {
        console.log('WebSocket disconnected')
      })

      echoInstance.connector.pusher.connection.bind('error', (error) => {
        console.error('WebSocket connection error:', error)
        Toast.fail(i18n.t('echo.connectFail'))
      })

      // 存储实例到全局
      window.Echo = echoInstance
      window.client = echoInstance
    } catch (error) {
      console.error('Failed to initialize Echo:', error)
      Toast.fail(i18n.t('echo.initFail'))
    }
  },

  /**
   * 设置频道监听
   */
  setupChannels() {
    if (!echoInstance) {
      console.warn('Echo instance not found')
      return
    }

    try {
      const userData = JSON.parse(localStorage.getItem('authUser') || '{}')
      const userId = userData.user?.id

      if (!userId) {
        console.warn('User ID missing, cannot set private channel')
        return
      }

      // 监听私有频道 - 接收个人消息
      echoInstance
        .private(`App.User.${userId}`)
        .listen('MessageSent', (event) => {
          console.log('New message received:', event)
          this.handleNewMessage(event)
        })
        .listen('MessageRead', (event) => {
          console.log('Message read:', event)
          this.handleMessageRead(event)
        })

      // 监听在线状态频道
      echoInstance
        .join('online')
        .here((users) => {
          console.log('Online users:', users)
          store.commit('setOnlineUsers', users)
        })
        .joining((user) => {
          console.log('User joined:', user)
          store.commit('addOnlineUser', user)
        })
        .leaving((user) => {
          console.log('User left:', user)
          store.commit('removeOnlineUser', user)
        })

      console.log('Channel listening setup complete')
    } catch (error) {
      console.error('Failed to setup channel listening:', error)
    }
  },

  /**
   * 处理新消息
   */
  handleNewMessage(event) {
    try {
      const message = {
        id: event.message.id,
        content: event.message.content,
        sender_id: event.message.sender_id,
        receiver_id: event.message.receiver_id,
        created_at: event.message.created_at,
        sender: event.sender,
        isMine: false,
      }

      // 添加到消息列表
      store.commit('addMessage', message)

      // 更新未读计数
      store.commit('updateUnreadCount', store.state.unreadCount + 1)

      // 显示通知
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(
          i18n.t('echo.newMessage', { name: event.sender.name }),
          {
            body: message.content,
            icon: event.sender.avatar || '/images/default-avatar.png',
            tag: `message-${message.id}`,
          }
        )
      }

      // 播放提示音
      this.playNotificationSound()
    } catch (error) {
      console.error('Failed to handle new message:', error)
    }
  },

  /**
   * 处理消息已读
   */
  handleMessageRead(event) {
    try {
      // 更新消息状态
      store.commit('markMessageAsRead', event.messageId)
    } catch (error) {
      console.error('Failed to handle message read:', error)
    }
  },

  /**
   * 播放通知音
   */
  playNotificationSound() {
    try {
      const soundEnabled = localStorage.getItem('sound_enabled')
      if (soundEnabled === 'false') {
        return
      }

      const audio = new Audio('/sounds/notification.mp3')
      audio.volume = 0.5
      audio.play().catch((error) => {
        console.warn('Failed to play notification sound:', error)
      })
    } catch (error) {
      console.warn('Error playing notification sound:', error)
    }
  },

  /**
   * 断开连接
   */
  disconnect() {
    if (echoInstance) {
      try {
        echoInstance.disconnect()
        echoInstance = null
        window.Echo = null
        window.client = null
        console.log('WebSocket disconnected')
      } catch (error) {
        console.error('Failed to disconnect WebSocket:', error)
      }
    }
  },

  /**
   * 重连
   */
  reconnect() {
    this.disconnect()
    setTimeout(() => {
      this.run()
    }, 1000)
  },

  /**
   * 获取Echo实例
   */
  getInstance() {
    return echoInstance
  },
}
