<template>
  <div class="setting">
    <!-- 导航栏 -->
    <van-nav-bar 
      title="设置" 
      left-arrow 
      @click-left="$router.go(-1)" 
      fixed 
    />

    <!-- 设置选项 -->
    <div class="setting__content">
      <!-- 个人信息 -->
      <van-cell-group title="个人信息">
        <van-cell 
          title="头像" 
          :value="userInfo.name" 
          is-link
          @click="editProfile"
        >
          <template #icon>
            <van-image
              class="setting__avatar"
              :src="userInfo.avatar || defaultAvatar"
              round
              width="32px"
              height="32px"
            />
          </template>
        </van-cell>
        
        <van-cell 
          title="昵称" 
          :value="userInfo.name" 
          is-link
          @click="editNickname"
        />
        
        <van-cell 
          title="邮箱" 
          :value="userInfo.email" 
          is-link
          @click="editEmail"
        />
      </van-cell-group>

      <!-- 应用设置 -->
      <van-cell-group title="应用设置">
        <van-cell title="语言设置" is-link @click="showLanguageSelector = true">
          <template #value>
            <span class="setting__value">{{ currentLanguageName }}</span>
          </template>
        </van-cell>
        
        <van-cell title="主题模式" is-link @click="showThemeSelector = true">
          <template #value>
            <span class="setting__value">{{ currentThemeName }}</span>
          </template>
        </van-cell>
        
        <van-cell title="消息通知">
          <template #right-icon>
            <van-switch 
              v-model="notificationEnabled" 
              @change="toggleNotification"
              active-color="#07c160"
            />
          </template>
        </van-cell>
        
        <van-cell title="声音提醒">
          <template #right-icon>
            <van-switch 
              v-model="soundEnabled" 
              @change="toggleSound"
              active-color="#07c160"
            />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 其他设置 -->
      <van-cell-group title="其他">
        <van-cell title="清除缓存" is-link @click="clearCache" />
        <van-cell title="关于我们" is-link @click="showAbout" />
        <van-cell title="用户协议" is-link @click="showTerms" />
        <van-cell title="隐私政策" is-link @click="showPrivacy" />
      </van-cell-group>

      <!-- 退出登录 -->
      <div class="setting__logout">
        <van-button
          type="danger"
          size="large"
          @click="handleLogout"
        >
          退出登录
        </van-button>
      </div>
    </div>

    <!-- 语言选择弹窗 -->
    <van-popup 
      v-model="showLanguageSelector" 
      position="bottom"
      round
    >
      <van-picker
        :columns="languageColumns"
        @confirm="onLanguageConfirm"
        @cancel="showLanguageSelector = false"
      />
    </van-popup>

    <!-- 主题选择弹窗 -->
    <van-popup 
      v-model="showThemeSelector" 
      position="bottom"
      round
    >
      <van-picker
        :columns="themeColumns"
        @confirm="onThemeConfirm"
        @cancel="showThemeSelector = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'Setting',
  data() {
    return {
      defaultAvatar: '/images/default-avatar.png',
      showLanguageSelector: false,
      showThemeSelector: false,
      notificationEnabled: true,
      soundEnabled: true,
      languageColumns: [
        { text: '中文', value: 'zh' },
        { text: 'English', value: 'en' },
        { text: 'Deutsch', value: 'de' },
        { text: 'Français', value: 'fr' },
        { text: '日本語', value: 'ja' },
        { text: '한국어', value: 'ko' }
      ],
      themeColumns: [
        { text: '浅色模式', value: 'light' },
        { text: '深色模式', value: 'dark' },
        { text: '跟随系统', value: 'auto' }
      ]
    }
  },
  computed: {
    ...mapState(['user', 'language', 'theme']),
    userInfo() {
      return this.user || {
        name: '未登录',
        email: '',
        avatar: ''
      }
    },
    currentLanguageName() {
      const lang = this.languageColumns.find(item => item.value === this.language)
      return lang ? lang.text : '中文'
    },
    currentThemeName() {
      const theme = this.themeColumns.find(item => item.value === this.theme)
      return theme ? theme.text : '浅色模式'
    }
  },
  methods: {
    ...mapMutations(['setLanguage', 'setTheme']),
    ...mapActions(['logout']),

    editProfile() {
      this.$toast('个人资料编辑功能开发中...')
    },

    editNickname() {
      this.$dialog.prompt({
        title: '修改昵称',
        message: '请输入新的昵称'
      }).then(value => {
        if (value) {
          // 更新昵称逻辑
          this.$toast.success('昵称修改成功')
        }
      }).catch(() => {})
    },

    editEmail() {
      this.$toast('邮箱修改功能开发中...')
    },

    onLanguageConfirm(value) {
      this.setLanguage(value)
      this.showLanguageSelector = false
      this.$toast.success(`已切换到${this.currentLanguageName}`)
    },

    onThemeConfirm(value) {
      this.setTheme(value)
      this.showThemeSelector = false
      this.$toast.success(`已切换到${this.currentThemeName}`)
    },

    toggleNotification(enabled) {
      this.notificationEnabled = enabled
      localStorage.setItem('notification_enabled', enabled)
      this.$toast.success(enabled ? '通知已开启' : '通知已关闭')
    },

    toggleSound(enabled) {
      this.soundEnabled = enabled
      localStorage.setItem('sound_enabled', enabled)
      this.$toast.success(enabled ? '声音已开启' : '声音已关闭')
    },

    clearCache() {
      this.$dialog.confirm({
        title: '清除缓存',
        message: '确定要清除应用缓存吗？'
      }).then(() => {
        // 清除缓存逻辑
        localStorage.removeItem('app_cache')
        this.$toast.success('缓存清除成功')
      }).catch(() => {})
    },

    showAbout() {
      this.$dialog.alert({
        title: '关于我们',
        message: 'Vue聊天应用 v1.0.0\n\n这是一个基于Vue.js开发的多语言聊天应用，支持实时翻译功能。'
      })
    },

    showTerms() {
      this.$toast('用户协议页面开发中...')
    },

    showPrivacy() {
      this.$toast('隐私政策页面开发中...')
    },

    async handleLogout() {
      this.$dialog.confirm({
        title: '退出登录',
        message: '确定要退出当前账号吗？'
      }).then(() => {
        this.logout()
        this.$toast.success('已退出登录')
        this.$router.push('/login')
      }).catch(() => {})
    }
  },

  mounted() {
    // 从本地存储恢复设置
    const notificationEnabled = localStorage.getItem('notification_enabled')
    if (notificationEnabled !== null) {
      this.notificationEnabled = notificationEnabled === 'true'
    }

    const soundEnabled = localStorage.getItem('sound_enabled')
    if (soundEnabled !== null) {
      this.soundEnabled = soundEnabled === 'true'
    }
  }
}
</script>

<style lang="less" scoped>
.setting {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-top: 46px;
}

.setting__content {
  padding: 16px 0;
}

.setting__avatar {
  margin-right: 12px;
}

.setting__value {
  color: #969799;
  font-size: 14px;
}

.setting__logout {
  margin: 32px 16px 16px;
}

// 深色主题适配
.dark-theme {
  .setting {
    background-color: #1c1c1e;
  }
  
  .setting__value {
    color: #8e8e93;
  }
}

// 响应式适配
@media (max-width: 375px) {
  .setting__logout {
    margin: 24px 12px 12px;
  }
}
</style>
