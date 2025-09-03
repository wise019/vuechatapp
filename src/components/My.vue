<template>
  <div class="my">
    <!-- 导航栏 -->
    <van-nav-bar :title="$t('my.title')" fixed>
      <template #right>
        <van-icon name="setting-o" @click="$router.push('/setting')" />
      </template>
    </van-nav-bar>

    <!-- 用户信息卡片 -->
    <div class="my__header">
      <div class="user-card">
        <van-image
          class="user-card__avatar"
          :src="userInfo.avatar || defaultAvatar"
          round
          width="60px"
          height="60px"
        />
        <div class="user-card__info">
          <div class="user-card__name">{{ userInfo.name || $t('my.noNickname') }}</div>
          <div class="user-card__email">{{ userInfo.email || $t('my.noEmail') }}</div>
          <div class="user-card__status">
            <van-tag 
              :type="isOnline ? 'success' : 'default'"
              size="mini"
            >
              {{ isOnline ? $t('my.online') : $t('my.offline') }}
            </van-tag>
          </div>
        </div>
        <van-icon name="arrow" class="user-card__arrow" />
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="my__content">
      <!-- 消息统计 -->
      <van-cell-group :title="$t('my.statsSection')">
        <van-cell
          :title="$t('my.unread')"
          :value="unreadCount + $t('my.items')"
          icon="chat-o"
          is-link
          @click="$router.push('/message')"
        />
        <van-cell
          :title="$t('my.today')"
          :value="todayMessages + $t('my.items')"
          icon="edit"
        />
        <van-cell
          :title="$t('my.friends')"
          :value="friendCount + $t('my.people')"
          icon="friends-o"
        />
      </van-cell-group>

      <!-- 功能入口 -->
      <van-cell-group :title="$t('my.featuresSection')">
        <van-cell
          :title="$t('my.history')"
          icon="language-o"
          is-link
          @click="showTranslateHistory"
        />
        <van-cell
          :title="$t('my.backup')"
          icon="records"
          is-link
          @click="showBackup"
        />
        <van-cell
          :title="$t('my.blocklist')"
          icon="contact"
          is-link
          @click="showBlockList"
        />
        <van-cell
          :title="$t('my.feedback')"
          icon="comment-o"
          is-link
          @click="showFeedback"
        />
      </van-cell-group>

      <!-- 帮助与支持 -->
      <van-cell-group :title="$t('my.supportSection')">
        <van-cell
          :title="$t('my.help')"
          icon="question-o"
          is-link
          @click="showHelp"
        />
        <van-cell
          :title="$t('my.contact')"
          icon="service-o"
          is-link
          @click="contactSupport"
        />
        <van-cell
          :title="$t('my.version')"
          :value="appVersion"
          icon="info-o"
        />
      </van-cell-group>

      <!-- 快捷操作 -->
      <div class="my__actions">
        <van-row gutter="12">
          <van-col span="12">
            <van-button 
              type="primary" 
              size="large" 
              @click="$router.push('/message')"
            >
              {{ $t('my.startChat') }}
            </van-button>
          </van-col>
          <van-col span="12">
            <van-button 
              type="default" 
              size="large"
              @click="shareApp"
            >
              {{ $t('my.shareApp') }}
            </van-button>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'My',
  data() {
    return {
      defaultAvatar: '/images/default-avatar.png',
      isOnline: true,
      todayMessages: 12,
      friendCount: 5,
      appVersion: 'v1.0.0'
    }
  },
  computed: {
    ...mapState(['user', 'unreadCount']),
    userInfo() {
      return this.user || {
        name: '',
        email: '',
        avatar: ''
      }
    }
  },
  methods: {
    showTranslateHistory() {
      this.$toast(this.$t('my.historyTip'))
    },

    showBackup() {
      this.$dialog.confirm({
        title: this.$t('my.backupTitle'),
        message: this.$t('my.backupMessage')
      }).then(() => {
        this.$toast.loading(this.$t('my.backupLoading'))
        setTimeout(() => {
          this.$toast.clear()
          this.$toast.success(this.$t('my.backupSuccess'))
        }, 2000)
      }).catch(() => {})
    },

    showBlockList() {
      this.$toast(this.$t('my.blockTip'))
    },

    showFeedback() {
      this.$dialog.prompt({
        title: this.$t('my.feedbackTitle'),
        message: this.$t('my.feedbackMessage')
      }).then(value => {
        if (value) {
          this.$toast.success(this.$t('my.feedbackSuccess'))
        }
      }).catch(() => {})
    },

    showHelp() {
      this.$dialog.alert({
        title: this.$t('my.helpTitle'),
        message: this.$t('my.helpMessage')
      })
    },

    contactSupport() {
      this.$dialog.alert({
        title: this.$t('my.contactTitle'),
        message: this.$t('my.contactMessage')
      })
    },

    shareApp() {
      if (navigator.share) {
        navigator.share({
          title: this.$t('my.shareTitle'),
          text: this.$t('my.shareText'),
          url: window.location.origin
        })
      } else {
        // 复制链接到剪贴板
        const url = window.location.origin
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => {
            this.$toast.success(this.$t('my.linkCopied'))
          })
        } else {
          this.$toast(this.$t('my.copyLinkTip', { url }))
        }
      }
    },

    editProfile() {
      this.$router.push('/profile')
    },

    async fetchStats() {
      try {
        // 这里应该调用API获取实际数据
        // const response = await this.$api.get('/user/stats')
        // this.todayMessages = response.data.todayMessages
        // this.friendCount = response.data.friendCount

        // 模拟数据
        setTimeout(() => {
          this.todayMessages = Math.floor(Math.random() * 50)
          this.friendCount = Math.floor(Math.random() * 20) + 1
        }, 1000)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }
  },

  mounted() {
    // 定期更新在线状态
    setInterval(() => {
      this.isOnline = navigator.onLine
    }, 5000)

    // 模拟获取消息统计数据
    this.fetchStats()
  }
}
</script>

<style lang="less" scoped>
.my {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-top: 46px;
}

.my__header {
  padding: 20px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  .user-card {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 16px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }
  
  .user-card__avatar {
    margin-right: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
  
  .user-card__info {
    flex: 1;
  }
  
  .user-card__name {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .user-card__email {
    font-size: 14px;
    opacity: 0.8;
    margin-bottom: 8px;
  }
  
  .user-card__status {
    .van-tag {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
  }
  
  .user-card__arrow {
    color: rgba(255, 255, 255, 0.6);
    font-size: 16px;
  }
}

.my__content {
  padding: 16px 0;
}

.my__actions {
  margin: 24px 16px 16px;
}

// 深色主题适配
.dark-theme {
  .my {
    background-color: #1c1c1e;
  }
  
  .my__header {
    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  }
}

// 响应式适配
@media (max-width: 375px) {
  .my__header {
    padding: 16px 12px;
  }
  
  .user-card {
    padding: 12px !important;
  }
  
  .user-card__name {
    font-size: 16px !important;
  }
  
  .my__actions {
    margin: 20px 12px 12px;
  }
}
</style>
