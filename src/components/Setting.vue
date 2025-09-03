<template>
  <div class="setting">
    <!-- 导航栏 -->
    <van-nav-bar
      :title="$t('settings.title')"
      left-arrow
      @click-left="$router.go(-1)"
      fixed
    />

    <!-- 设置选项 -->
    <div class="setting__content">
      <!-- 个人信息 -->
      <van-cell-group :title="$t('settings.profileSection')">
        <van-cell
          :title="$t('settings.avatar')"
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
          :title="$t('settings.nickname')"
          :value="userInfo.name"
          is-link
          @click="editNickname"
        />

        <van-cell
          :title="$t('settings.email')"
          :value="userInfo.email"
          is-link
          @click="editEmail"
        />
      </van-cell-group>

      <!-- 应用设置 -->
      <van-cell-group :title="$t('settings.appSettingsSection')">
        <van-cell
          :title="$t('settings.language')"
          is-link
          @click="showLanguageSelector = true"
        >
          <template #value>
            <span class="setting__value">{{ currentLanguageName }}</span>
          </template>
        </van-cell>

        <van-cell
          :title="$t('settings.theme')"
          is-link
          @click="showThemeSelector = true"
        >
          <template #value>
            <span class="setting__value">{{ currentThemeName }}</span>
          </template>
        </van-cell>

        <van-cell :title="$t('settings.notification')">
          <template #right-icon>
            <van-switch
              v-model="notificationEnabled"
              @change="toggleNotification"
              active-color="#07c160"
            />
          </template>
        </van-cell>

        <van-cell :title="$t('settings.sound')">
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
      <van-cell-group :title="$t('settings.otherSection')">
        <van-cell
          :title="$t('settings.clearCache')"
          is-link
          @click="clearCache"
        />
        <van-cell :title="$t('settings.about')" is-link @click="showAbout" />
        <van-cell :title="$t('settings.terms')" is-link @click="showTerms" />
        <van-cell
          :title="$t('settings.privacy')"
          is-link
          @click="showPrivacy"
        />
      </van-cell-group>

      <!-- 退出登录 -->
      <div class="setting__logout">
        <van-button type="danger" size="large" @click="handleLogout">
          {{ $t('settings.logout') }}
        </van-button>
      </div>
    </div>

    <!-- 语言选择弹窗 -->
    <van-popup v-model="showLanguageSelector" position="bottom" round>
      <van-picker
        :columns="languageColumns"
        @confirm="onLanguageConfirm"
        @cancel="showLanguageSelector = false"
      />
    </van-popup>

    <!-- 主题选择弹窗 -->
    <van-popup v-model="showThemeSelector" position="bottom" round>
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
    }
  },
  computed: {
    ...mapState(['user', 'language', 'theme']),
    userInfo() {
      return (
        this.user || {
          name: this.$t('settings.notLoggedIn'),
          email: '',
          avatar: '',
        }
      )
    },
    languageColumns() {
      return [
        { text: this.$t('language.zh'), value: 'zh' },
        { text: this.$t('language.en'), value: 'en' },
        { text: this.$t('language.de'), value: 'de' },
        { text: this.$t('language.fr'), value: 'fr' },
        { text: this.$t('language.ja'), value: 'ja' },
        { text: this.$t('language.ko'), value: 'ko' },
      ]
    },
    themeColumns() {
      return [
        { text: this.$t('settings.themeLight'), value: 'light' },
        { text: this.$t('settings.themeDark'), value: 'dark' },
        { text: this.$t('settings.themeAuto'), value: 'auto' },
      ]
    },
    currentLanguageName() {
      const lang = this.languageColumns.find(
        (item) => item.value === this.language
      )
      return lang ? lang.text : this.$t('language.zh')
    },
    currentThemeName() {
      const theme = this.themeColumns.find((item) => item.value === this.theme)
      return theme ? theme.text : this.$t('settings.themeLight')
    },
  },
  methods: {
    ...mapMutations(['setLanguage', 'setTheme']),
    ...mapActions(['logout']),

    editProfile() {
      this.$toast(this.$t('settings.profileEditTip'))
    },

    editNickname() {
      this.$dialog
        .prompt({
          title: this.$t('settings.editNickname'),
          message: this.$t('settings.enterNewNickname'),
        })
        .then((value) => {
          if (value) {
            // 更新昵称逻辑
            this.$toast.success(this.$t('settings.nicknameUpdated'))
          }
        })
        .catch(() => {})
    },

    editEmail() {
      this.$toast(this.$t('settings.emailEditTip'))
    },

    onLanguageConfirm(value) {
      this.setLanguage(value)
      this.showLanguageSelector = false
      this.$toast.success(
        this.$t('settings.switchLanguageSuccess', {
          lang: this.currentLanguageName,
        })
      )
    },

    onThemeConfirm(value) {
      this.setTheme(value)
      this.showThemeSelector = false
      this.$toast.success(
        this.$t('settings.switchThemeSuccess', { theme: this.currentThemeName })
      )
    },

    toggleNotification(enabled) {
      this.notificationEnabled = enabled
      localStorage.setItem('notification_enabled', enabled)
      this.$toast.success(
        this.$t(
          enabled ? 'settings.notificationOn' : 'settings.notificationOff'
        )
      )
    },

    toggleSound(enabled) {
      this.soundEnabled = enabled
      localStorage.setItem('sound_enabled', enabled)
      this.$toast.success(
        this.$t(enabled ? 'settings.soundOn' : 'settings.soundOff')
      )
    },

    clearCache() {
      this.$dialog
        .confirm({
          title: this.$t('settings.clearCache'),
          message: this.$t('settings.clearCacheConfirm'),
        })
        .then(() => {
          // 清除缓存逻辑
          localStorage.removeItem('app_cache')
          this.$toast.success(this.$t('settings.clearCacheSuccess'))
        })
        .catch(() => {})
    },

    showAbout() {
      this.$dialog.alert({
        title: this.$t('settings.about'),
        message: this.$t('settings.aboutMessage'),
      })
    },

    showTerms() {
      this.$toast(this.$t('settings.termsTip'))
    },

    showPrivacy() {
      this.$toast(this.$t('settings.privacyTip'))
    },

    async handleLogout() {
      this.$dialog
        .confirm({
          title: this.$t('settings.logout'),
          message: this.$t('settings.logoutConfirm'),
        })
        .then(() => {
          this.logout()
          this.$toast.success(this.$t('settings.logoutSuccess'))
          this.$router.push('/login')
        })
        .catch(() => {})
    },
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
  },
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
