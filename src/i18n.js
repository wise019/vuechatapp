import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './locales/zh.json'
import en from './locales/en.json'

Vue.use(VueI18n)

const locale = localStorage.getItem('app_language') || 'zh'

const i18n = new VueI18n({
  locale,
  messages: { zh, en },
})

export default i18n
