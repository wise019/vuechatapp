<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar :title="$t('tab.home')" fixed>
      <template #right>
        <van-icon name="setting-o" @click="$router.push('/setting')" />
      </template>
    </van-nav-bar>

    <!-- 搜索区域 -->
    <div class="home__content">
      <van-cell-group>
        <!-- 语言选择 -->
        <van-field
          v-model="selectedLanguage"
          :label="$t('home.languageLabel')"
          :placeholder="$t('home.languagePlaceholder')"
          readonly
          @click="showLanguagePicker = true"
        />

        <!-- 搜索框 -->
        <van-field
          v-model="searchTitle"
          :label="$t('home.searchLabel')"
          :placeholder="$t('home.searchPlaceholder')"
          clearable
        />
      </van-cell-group>

      <!-- 搜索按钮 -->
      <div class="search__btn">
        <van-button type="primary" size="large" @click="handleSearch">
          {{ $t('home.searchButton') }}
        </van-button>
      </div>

      <!-- 快捷操作 -->
      <div class="home__actions">
        <van-grid :column-num="2" :gutter="10">
          <van-grid-item
            icon="chat-o"
            :text="$t('my.startChat')"
            @click="$router.push('/message')"
          />
          <van-grid-item
            icon="friends-o"
            :text="$t('home.myFriends')"
            @click="$router.push('/my')"
          />
        </van-grid>
      </div>
    </div>

    <!-- 语言选择弹窗 -->
    <van-popup v-model="showLanguagePicker" position="bottom" round>
      <van-picker
        :columns="languageColumns"
        @confirm="onLanguageConfirm"
        @cancel="showLanguagePicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
      searchTitle: '',
      showLanguagePicker: false,
    }
  },
  computed: {
    ...mapState(['language']),
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
    selectedLanguage() {
      const lang = this.languageColumns.find(
        (item) => item.value === this.language
      )
      return lang ? lang.text : this.$t('language.zh')
    },
  },
  methods: {
    ...mapMutations(['setLanguage']),
    handleSearch() {
      if (!this.searchTitle.trim()) {
        this.$toast(this.$t('home.searchInputEmpty'))
        return
      }

      // 执行搜索逻辑
      this.$toast(this.$t('home.searchTip'))
    },

    onLanguageConfirm(value) {
      this.setLanguage(value)
      this.showLanguagePicker = false
      this.$toast(
        this.$t('home.languageSwitched', { lang: this.selectedLanguage })
      )
    },
  },
  mounted() {
    // 从本地存储恢复语言设置
    const savedLanguage = localStorage.getItem('app_language')
    if (savedLanguage) {
      this.setLanguage(savedLanguage)
    }
  },
}
</script>

<style lang="less" scoped>
.home {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-top: 46px;
}

.home__content {
  padding: 16px;
}

.search__btn {
  margin-top: 24px;
}

.home__actions {
  margin-top: 32px;

  .van-grid-item {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}

// 响应式适配
@media (max-width: 375px) {
  .home__content {
    padding: 12px;
  }
}
</style>
