<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar title="首页" fixed>
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
          label="语言"
          placeholder="选择语言"
          readonly
          @click="showLanguagePicker = true"
        />
        
        <!-- 搜索框 -->
        <van-field
          v-model="searchTitle"
          label="搜索"
          placeholder="请输入搜索内容"
          clearable
        />
      </van-cell-group>

      <!-- 搜索按钮 -->
      <div class="search__btn">
        <van-button 
          type="primary" 
          size="large"
          @click="handleSearch"
        >
          开始筛选
        </van-button>
      </div>

      <!-- 快捷操作 -->
      <div class="home__actions">
        <van-grid :column-num="2" :gutter="10">
          <van-grid-item 
            icon="chat-o" 
            text="开始聊天"
            @click="$router.push('/message')"
          />
          <van-grid-item 
            icon="friends-o" 
            text="我的好友"
            @click="$router.push('/my')"
          />
        </van-grid>
      </div>
    </div>

    <!-- 语言选择弹窗 -->
    <van-popup 
      v-model="showLanguagePicker" 
      position="bottom"
      round
    >
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
      languageColumns: [
        { text: '中文', value: 'zh' },
        { text: 'English', value: 'en' },
        { text: 'Deutsch', value: 'de' },
        { text: 'Français', value: 'fr' },
        { text: '日本語', value: 'ja' },
        { text: '한국어', value: 'ko' }
      ]
    }
  },
  computed: {
    ...mapState(['language']),
    selectedLanguage() {
      const lang = this.languageColumns.find(item => item.value === this.language)
      return lang ? lang.text : '中文'
    }
  },
  methods: {
    ...mapMutations(['setLanguage']),
    handleSearch() {
      if (!this.searchTitle.trim()) {
        this.$toast('请输入搜索内容')
        return
      }
      
      // 执行搜索逻辑
      this.$toast('搜索功能开发中...')
    },
    
    onLanguageConfirm(value) {
      this.setLanguage(value)
      this.showLanguagePicker = false
      this.$toast(`已切换到${this.selectedLanguage}`)
    }
  },
  mounted() {
    // 从本地存储恢复语言设置
    const savedLanguage = localStorage.getItem('app_language')
    if (savedLanguage) {
      this.setLanguage(savedLanguage)
    }
  }
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
