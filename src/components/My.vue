<template>
  <div class="my">
    <!-- 导航栏 -->
    <van-nav-bar title="我的" fixed>
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
          <div class="user-card__name">{{ userInfo.name || '未设置昵称' }}</div>
          <div class="user-card__email">{{ userInfo.email || '未设置邮箱' }}</div>
          <div class="user-card__status">
            <van-tag 
              :type="isOnline ? 'success' : 'default'"
              size="mini"
            >
              {{ isOnline ? '在线' : '离线' }}
            </van-tag>
          </div>
        </div>
        <van-icon name="arrow" class="user-card__arrow" />
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="my__content">
      <!-- 消息统计 -->
      <van-cell-group title="消息统计">
        <van-cell 
          title="未读消息" 
          :value="unreadCount + '条'"
          icon="chat-o"
          is-link
          @click="$router.push('/message')"
        />
        <van-cell 
          title="今日发送" 
          :value="todayMessages + '条'"
          icon="edit"
        />
        <van-cell 
          title="好友数量" 
          :value="friendCount + '人'"
          icon="friends-o"
        />
      </van-cell-group>

      <!-- 功能入口 -->
      <van-cell-group title="功能">
        <van-cell 
          title="翻译历史" 
          icon="language-o"
          is-link
          @click="showTranslateHistory"
        />
        <van-cell 
          title="消息备份" 
          icon="records"
          is-link
          @click="showBackup"
        />
        <van-cell 
          title="黑名单管理" 
          icon="contact"
          is-link
          @click="showBlockList"
        />
        <van-cell 
          title="反馈建议" 
          icon="comment-o"
          is-link
          @click="showFeedback"
        />
      </van-cell-group>

      <!-- 帮助与支持 -->
      <van-cell-group title="帮助与支持">
        <van-cell 
          title="使用帮助" 
          icon="question-o"
          is-link
          @click="showHelp"
        />
        <van-cell 
          title="联系客服" 
          icon="service-o"
          is-link
          @click="contactSupport"
        />
        <van-cell 
          title="版本信息" 
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
              开始聊天
            </van-button>
          </van-col>
          <van-col span="12">
            <van-button 
              type="default" 
              size="large"
              @click="shareApp"
            >
              分享应用
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
      this.$toast('翻译历史功能开发中...')
    },

    showBackup() {
      this.$dialog.confirm({
        title: '消息备份',
        message: '是否要备份聊天记录到云端？'
      }).then(() => {
        this.$toast.loading('正在备份...')
        
        setTimeout(() => {
          this.$toast.success('备份完成')
        }, 2000)
      }).catch(() => {})
    },

    showBlockList() {
      this.$toast('黑名单管理功能开发中...')
    },

    showFeedback() {
      this.$dialog.prompt({
        title: '反馈建议',
        message: '请输入您的建议或意见'
      }).then(value => {
        if (value) {
          this.$toast.success('感谢您的反馈!')
        }
      }).catch(() => {})
    },

    showHelp() {
      this.$dialog.alert({
        title: '使用帮助',
        message: `
使用说明：
1. 在聊天界面输入消息并发送
2. 点击翻译按钮可翻译对方消息
3. 在设置中可切换界面语言
4. 支持多种语言翻译功能
        `
      })
    },

    contactSupport() {
      this.$dialog.alert({
        title: '联系客服',
        message: '客服邮箱: support@chatapp.com\n客服电话: 400-123-4567\n工作时间: 9:00-18:00'
      })
    },

    shareApp() {
      if (navigator.share) {
        navigator.share({
          title: 'Vue聊天应用',
          text: '一个支持实时翻译的聊天应用',
          url: window.location.origin
        })
      } else {
        // 复制链接到剪贴板
        const url = window.location.origin
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => {
            this.$toast.success('链接已复制到剪贴板')
          })
        } else {
          this.$toast('请手动复制链接: ' + url)
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
        console.error('获取统计数据失败:', error)
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