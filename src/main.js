import Vue from 'vue'
import App from './components/App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import './plugins/vant'
import './assets/css/base.css'

Vue.config.productionTip = false

// 全局错误处理
Vue.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err, info)
}

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
