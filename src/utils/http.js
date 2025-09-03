import axios from 'axios'
import qs from 'qs'
import router from '@/router'
import { Toast } from 'vant'
import i18n from '@/i18n'

// 创建axios实例
const http = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  config => {
    // 添加认证token
    const authUser = localStorage.getItem('authUser')
    if (authUser) {
      try {
        const userData = JSON.parse(authUser)
        if (userData.access_token) {
          config.headers.Authorization = `Bearer ${userData.access_token}`
        }
      } catch (error) {
        console.error('Failed to parse user data:', error)
        localStorage.removeItem('authUser')
      }
    }

    // 如果是POST请求且数据是对象，则序列化为form格式
    if (config.method === 'post' && config.data && typeof config.data === 'object') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      config.data = qs.stringify(config.data)
    }

    return config
  },
  error => {
    console.error('Request configuration error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // 处理网络错误
    if (!error.response) {
      Toast.fail(i18n.t('http.networkError'))
      return Promise.resolve({
        status: -1,
        data: { error: i18n.t('http.networkErrorShort') }
      })
    }

    // 返回错误响应以便后续处理
    return Promise.resolve(error.response)
  }
)

// 统一的响应状态检查
function checkStatus(response) {
  if (response && (
    response.status === 200 || 
    response.status === 422 || 
    response.status === 401
  )) {
    return response
  }
  
  return {
    status: -404,
    data: { error: i18n.t('http.requestException') }
  }
}

// 统一的错误处理
function checkCode(response) {
  const res = checkStatus(response)
  
  // 请求异常
  if (res.status === -404) {
    Toast.fail(res.data.error || i18n.t('http.requestFail'))
    return res
  }
  
  // 认证失败，跳转登录页
  if (res.status === 401) {
    localStorage.removeItem('authUser')
    router.push('/login')
    Toast.fail(i18n.t('http.loginExpired'))
    return res
  }
  
  // 表单验证错误
  if (res.status === 422 && res.data) {
    let errorMessage = i18n.t('http.validationFailed')
    
    if (res.data.error) {
      errorMessage = res.data.error
    } else if (res.data.errors) {
      const errors = res.data.errors
      // 获取第一个错误信息
      for (const key in errors) {
        if (errors[key] && errors[key].length > 0) {
          errorMessage = errors[key][0]
          break
        }
      }
    }
    
    Toast.fail(errorMessage)
    return res
  }
  
  return res
}

// 导出HTTP方法
export default {
  // GET请求
  get(url, params = {}) {
    return http.get(url, { params }).then(checkCode)
  },

  // POST请求
  post(url, data = {}) {
    return http.post(url, data).then(checkCode)
  },

  // PUT请求
  put(url, data = {}) {
    return http.put(url, data).then(checkCode)
  },

  // DELETE请求
  delete(url, params = {}) {
    return http.delete(url, { params }).then(checkCode)
  },

  // 上传文件
  upload(url, formData) {
    return http.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(checkCode)
  }
}

// 将http实例挂载到Vue原型上
import Vue from 'vue'
Vue.prototype.$api = http
