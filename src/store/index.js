import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    direction: '', // 路由动画方向
    user: null, // 当前用户信息
    messages: [], // 聊天消息
    contacts: [], // 联系人列表
    currentChat: null, // 当前聊天对象
    unreadCount: 0, // 未读消息数量
    language: 'zh', // 当前语言
    theme: 'light' // 主题模式
  },

  mutations: {
    // 更新路由动画方向
    updateDirection(state, { direction }) {
      state.direction = direction
    },

    // 设置用户信息
    setUser(state, user) {
      state.user = user
    },

    // 添加消息
    addMessage(state, message) {
      state.messages.push(message)
    },

    // 设置消息列表
    setMessages(state, messages) {
      state.messages = messages
    },

    // 更新联系人列表
    setContacts(state, contacts) {
      state.contacts = contacts
    },

    // 设置当前聊天对象
    setCurrentChat(state, chat) {
      state.currentChat = chat
    },

    // 更新未读消息数量
    updateUnreadCount(state, count) {
      state.unreadCount = count
    },

    // 设置语言
    setLanguage(state, language) {
      state.language = language
      // 持久化到本地存储
      localStorage.setItem('app_language', language)
    },

    // 设置主题
    setTheme(state, theme) {
      state.theme = theme
      localStorage.setItem('app_theme', theme)
    },

    // 清除用户数据
    clearUserData(state) {
      state.user = null
      state.messages = []
      state.contacts = []
      state.currentChat = null
      state.unreadCount = 0
    }
  },

  actions: {
    // 登录
    async login({ commit }, credentials) {
      try {
        const response = await this.$api.post('/oauth/token', credentials)
        if (response.status === 200) {
          const user = response.data
          localStorage.setItem('authUser', JSON.stringify(user))
          commit('setUser', user)
          return { success: true }
        }
        return { success: false, message: '登录失败' }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    // 登出
    logout({ commit }) {
      localStorage.removeItem('authUser')
      commit('clearUserData')
    },

    // 发送消息
    async sendMessage({ commit, state }, messageData) {
      try {
        const response = await this.$api.post('/sendMsg', messageData)
        if (response.status === 200) {
          commit('addMessage', response.data)
          return { success: true }
        }
        return { success: false }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },

    // 获取消息列表
    async fetchMessages({ commit }) {
      try {
        const response = await this.$api.get('/chat')
        if (response.status === 200) {
          commit('setMessages', response.data)
        }
      } catch (error) {
        console.error('获取消息失败:', error)
      }
    }
  },

  getters: {
    isAuthenticated: state => !!state.user,
    currentUser: state => state.user,
    messagesByContact: state => contactId => {
      return state.messages.filter(msg => 
        msg.sender_id === contactId || msg.receiver_id === contactId
      )
    }
  }
})