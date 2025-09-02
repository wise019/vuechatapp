import http from './http'

/**
 * OAuth认证工具类
 */
export default {
  /**
   * 用户登录认证
   * @param {string} email 邮箱
   * @param {string} password 密码
   * @returns {Promise<boolean>} 登录是否成功
   */
  async request(email, password) {
    try {
      const response = await http.post('/oauth/token', {
        grant_type: 'password',
        client_id: process.env.VUE_APP_CLIENT_ID || 2,
        client_secret: process.env.VUE_APP_CLIENT_SECRET || 'your-client-secret',
        username: email,
        password: password,
        scope: '*'
      })

      if (response.status === 200 && response.data) {
        // 存储用户认证信息
        const userData = {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          expires_in: response.data.expires_in,
          token_type: response.data.token_type,
          user: response.data.user || {
            email: email,
            name: response.data.name || email.split('@')[0]
          }
        }

        localStorage.setItem('authUser', JSON.stringify(userData))
        
        // 设置token过期时间
        const expiresAt = new Date().getTime() + (response.data.expires_in * 1000)
        localStorage.setItem('tokenExpiresAt', expiresAt.toString())

        return true
      }

      return false
    } catch (error) {
      console.error('OAuth认证失败:', error)
      return false
    }
  },

  /**
   * 刷新访问令牌
   * @returns {Promise<boolean>} 刷新是否成功
   */
  async refreshToken() {
    try {
      const authUser = localStorage.getItem('authUser')
      if (!authUser) {
        return false
      }

      const userData = JSON.parse(authUser)
      if (!userData.refresh_token) {
        return false
      }

      const response = await http.post('/oauth/token', {
        grant_type: 'refresh_token',
        refresh_token: userData.refresh_token,
        client_id: process.env.VUE_APP_CLIENT_ID || 2,
        client_secret: process.env.VUE_APP_CLIENT_SECRET || 'your-client-secret',
        scope: '*'
      })

      if (response.status === 200 && response.data) {
        // 更新token信息
        const newUserData = {
          ...userData,
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token || userData.refresh_token,
          expires_in: response.data.expires_in
        }

        localStorage.setItem('authUser', JSON.stringify(newUserData))
        
        const expiresAt = new Date().getTime() + (response.data.expires_in * 1000)
        localStorage.setItem('tokenExpiresAt', expiresAt.toString())

        return true
      }

      return false
    } catch (error) {
      console.error('刷新token失败:', error)
      return false
    }
  },

  /**
   * 检查token是否有效
   * @returns {boolean} token是否有效
   */
  isTokenValid() {
    const authUser = localStorage.getItem('authUser')
    const tokenExpiresAt = localStorage.getItem('tokenExpiresAt')

    if (!authUser || !tokenExpiresAt) {
      return false
    }

    const expiresAt = parseInt(tokenExpiresAt)
    const now = new Date().getTime()

    // 提前5分钟判断为过期，避免在请求过程中过期
    return now < (expiresAt - 5 * 60 * 1000)
  },

  /**
   * 获取当前用户信息
   * @returns {object|null} 用户信息
   */
  getCurrentUser() {
    try {
      const authUser = localStorage.getItem('authUser')
      if (authUser) {
        const userData = JSON.parse(authUser)
        return userData.user || null
      }
      return null
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  },

  /**
   * 退出登录
   */
  logout() {
    localStorage.removeItem('authUser')
    localStorage.removeItem('tokenExpiresAt')
  }
}
