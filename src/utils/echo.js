import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import store from '@/store'
import { Toast } from 'vant'

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
        console.warn('用户未登录，无法建立WebSocket连接')
        return
      }

      const userData = JSON.parse(authUser)
      if (!userData.access_token) {
        console.warn('访问令牌不存在，无法建立WebSocket连接')
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
            Authorization: `Bearer ${userData.access_token}`
          }
        }
      })

      // 监听连接事件
      echoInstance.connector.pusher.connection.bind('connected', () => {
        console.log('WebSocket连接已建立')
        this.setupChannels()
      })

      echoInstance.connector.pusher.connection.bind('disconnected', () => {
        console.log('WebSocket连接已断开')
      })

      echoInstance.connector.pusher.connection.bind('error', (error) => {
        console.error('WebSocket连接错误:', error)
        Toast.fail('实时消息连接失败')
      })

      // 存储实例到全局
      window.Echo = echoInstance
      window.client = echoInstance

    } catch (error) {
      console.error('初始化Echo失败:', error)
      Toast.fail('实时消息服务初始化失败')
    }
  },

  /**
   * 设置频道监听
   */
  setupChannels() {
    if (!echoInstance) {
      console.warn('Echo实例不存在')
      return
    }

    try {
      const userData = JSON.parse(localStorage.getItem('authUser') || '{}')
      const userId = userData.user?.id

      if (!userId) {
        console.warn('用户ID不存在，无法设置私有频道')
        return
      }

      // 监听私有频道 - 接收个人消息
      echoInstance.private(`App.User.${userId}`)
        .listen('MessageSent', (event) => {
          console.log('收到新消息:', event)
          this.handleNewMessage(event)
        })
        .listen('MessageRead', (event) => {
          console.log('消息已读:', event)
          this.handleMessageRead(event)
        })

      // 监听在线状态频道
      echoInstance.join('online')
        .here((users) => {
          console.log('当前在线用户:', users)
          store.commit('setOnlineUsers', users)
        })
        .joining((user) => {
          console.log('用户上线:', user)
          store.commit('addOnlineUser', user)
        })
        .leaving((user) => {
          console.log('用户下线:', user)
          store.commit('removeOnlineUser', user)
        })

      console.log('频道监听设置完成')

    } catch (error) {
      console.error('设置频道监听失败:', error)
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
        isMine: false
      }

      // 添加到消息列表
      store.commit('addMessage', message)

      // 更新未读计数
      store.commit('updateUnreadCount', store.state.unreadCount + 1)

      // 显示通知
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`来自 ${event.sender.name} 的消息`, {
          body: message.content,
          icon: event.sender.avatar || '/images/default-avatar.png',
          tag: `message-${message.id}`
        })
      }

      // 播放提示音
      this.playNotificationSound()

    } catch (error) {
      console.error('处理新消息失败:', error)
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
      console.error('处理消息已读失败:', error)
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
      audio.play().catch(error => {
        console.warn('播放通知音失败:', error)
      })
    } catch (error) {
      console.warn('播放通知音错误:', error)
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
        console.log('WebSocket连接已断开')
      } catch (error) {
        console.error('断开WebSocket连接失败:', error)
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
  }
}