<template>
  <div class="message">
    <!-- 导航栏 -->
    <van-nav-bar 
      :title="chatTitle" 
      left-arrow 
      @click-left="$router.go(-1)"
      fixed
    >
      <template #right>
        <van-icon name="more-o" @click="showMoreActions = true" />
      </template>
    </van-nav-bar>

    <!-- 消息列表 -->
    <div class="message-main" ref="messageContainer">
      <div class="message-list">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message-main-item', { 'message-main--mine': message.isMine }]"
        >
          <!-- 用户头像 -->
          <div class="message-main-item__user">
            <img 
              :src="message.avatar || defaultAvatar" 
              :alt="message.userName"
              class="message-main-item__img"
            >
          </div>
          
          <!-- 消息内容 -->
          <div class="message-main-item__text">
            {{ message.content }}
            
            <!-- 翻译按钮 -->
            <div 
              v-if="!message.isMine && message.content"
              class="message-main-item__translate-btn"
              @click="translateMessage(message, index)"
            />
          </div>

          <!-- 翻译结果 -->
          <div 
            v-if="message.translation" 
            class="message-main-item__translation"
          >
            <div class="translation-text">
              {{ message.translation }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 消息输入区域 -->
    <div class="message-send">
      <van-row gutter="8">
        <!-- 语言选择 -->
        <van-col span="7">
          <van-dropdown-menu>
            <van-dropdown-item 
              :value="selectedLanguage" 
              :options="languageOptions"
              @change="onLanguageChange"
            />
          </van-dropdown-menu>
        </van-col>

        <!-- 输入框 -->
        <van-col span="12">
          <van-field
            v-model="messageInput"
            placeholder="输入消息..."
            @keyup.enter="send"
          />
        </van-col>

        <!-- 发送按钮 -->
        <van-col span="5">
          <van-button
            class="message-send__btn"
            :loading="sendLoading"
            text="发送"
            @click="send"
          />
        </van-col>
      </van-row>
    </div>

    <!-- 更多操作面板 -->
    <van-action-sheet
      v-model="showMoreActions"
      :actions="moreActions"
      @select="onMoreActionSelect"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'Message',
  data() {
    return {
      messageInput: '',
      sendLoading: false,
      showMoreActions: false,
      selectedLanguage: 'zh',
      defaultAvatar: '/images/default-avatar.png',
      languageOptions: [
        { text: '中文', value: 'zh' },
        { text: 'English', value: 'en' },
        { text: 'Deutsch', value: 'de' },
        { text: 'Français', value: 'fr' },
        { text: '日本語', value: 'ja' },
        { text: '한국어', value: 'ko' }
      ],
      moreActions: [
        { name: '清空聊天记录', color: '#ee0a24' },
        { name: '举报用户', color: '#ff976a' }
      ],
      messages: [
        {
          id: 1,
          content: 'Hello, how are you?',
          isMine: false,
          userName: 'John',
          avatar: '/images/avatar1.png',
          timestamp: Date.now()
        },
        {
          id: 2,
          content: '我很好，谢谢！',
          isMine: true,
          userName: 'Me',
          timestamp: Date.now()
        }
      ]
    }
  },
  computed: {
    ...mapState(['currentChat', 'user']),
    chatTitle() {
      return this.currentChat ? this.currentChat.name : '聊天'
    }
  },
  methods: {
    ...mapActions(['sendMessage', 'fetchMessages']),
    ...mapMutations(['addMessage']),

    async send() {
      if (!this.messageInput.trim()) {
        this.$toast('请输入消息内容')
        return
      }

      this.sendLoading = true

      try {
        const newMessage = {
          id: Date.now(),
          content: this.messageInput,
          isMine: true,
          userName: 'Me',
          timestamp: Date.now()
        }

        // 添加到本地消息列表
        this.messages.push(newMessage)

        // 发送到服务器
        const result = await this.sendMessage({
          content: this.messageInput,
          receiver_id: this.currentChat?.id,
          language: this.selectedLanguage
        })

        if (result.success) {
          this.messageInput = ''
          this.scrollToBottom()
        } else {
          this.$toast.fail('发送失败')
        }
      } catch (error) {
        console.error('发送消息错误:', error)
        this.$toast.fail('发送失败，请稍后重试')
      } finally {
        this.sendLoading = false
      }
    },

    async translateMessage(message, index) {
      if (message.translating) return

      this.$set(this.messages, index, {
        ...message,
        translating: true
      })

      try {
        // 模拟翻译API调用
        const response = await this.$api.post('/translate', {
          text: message.content,
          from: 'auto',
          to: this.selectedLanguage
        })

        if (response.status === 200) {
          this.$set(this.messages, index, {
            ...message,
            translation: response.data.translation,
            translating: false
          })
        }
      } catch (error) {
        console.error('翻译失败:', error)
        this.$toast.fail('翻译失败')
        this.$set(this.messages, index, {
          ...message,
          translating: false
        })
      }
    },

    onLanguageChange(value) {
      this.selectedLanguage = value
      this.$toast(`已切换到${this.getLanguageName(value)}`)
    },

    getLanguageName(value) {
      const option = this.languageOptions.find(item => item.value === value)
      return option ? option.text : value
    },

    setTranslate(language) {
      this.selectedLanguage = language
      this.$toast(`已切换到${this.getLanguageName(language)}`)
    },

    onMoreActionSelect(action) {
      this.showMoreActions = false
      
      if (action.name === '清空聊天记录') {
        this.$dialog.confirm({
          title: '确认清空',
          message: '确定要清空聊天记录吗？此操作不可恢复。'
        }).then(() => {
          this.messages = []
          this.$toast.success('聊天记录已清空')
        }).catch(() => {})
      } else if (action.name === '举报用户') {
        this.$toast('举报功能开发中...')
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messageContainer
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    },

    simulateReceiveMessage() {
      // 模拟定期接收消息
      setTimeout(() => {
        this.messages.push({
          id: Date.now(),
          content: 'This is a simulated message',
          isMine: false,
          userName: 'Bot',
          avatar: '/images/bot-avatar.png',
          timestamp: Date.now()
        })
        this.scrollToBottom()
      }, 3000)
    }
  },

  mounted() {
    this.scrollToBottom()
    // 模拟接收消息
    this.simulateReceiveMessage()
  }
}
</script>

<style lang="less" scoped>
.message {
  min-height: 100vh;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  padding-top: 46px;
}

.message-main {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.message-list {
  padding: 0 16px;
}

.message-main-item {
  position: relative;
  margin-bottom: 16px;
  padding: 0 60px;
  min-height: 43px;
  display: flex;
  align-items: flex-start;
  
  &.message-main--mine {
    flex-direction: row-reverse;
    
    .message-main-item__user {
      right: 3px;
      left: auto;
    }
    
    .message-main-item__text {
      background-color: #07c160;
      color: #fff;
      margin-left: 0;
      margin-right: 16px;
      
      &:after {
        left: auto;
        right: -10px;
        border-color: #07c160 transparent transparent;
      }
    }
    
    .message-main-item__translate-btn {
      left: -8px;
    }
  }
}

.message-main-item__user {
  position: absolute;
  left: 3px;
  top: 0;
}

.message-main-item__img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.message-main-item__text {
  position: relative;
  line-height: 22px;
  padding: 10px 15px;
  background-color: #fff;
  border-radius: 8px;
  color: #333;
  word-break: break-word;
  max-width: 70%;
  margin-left: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:after {
    content: '';
    position: absolute;
    left: -10px;
    top: 15px;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-right-color: #fff;
  }
}

.message-main-item__translate-btn {
  width: 24px;
  height: 24px;
  position: absolute;
  bottom: -8px;
  right: -8px;
  background: url('/images/translate.svg') no-repeat center;
  background-size: 20px 20px;
  background-color: #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background-color: #f0f0f0;
  }
}

.message-main-item__translation {
  margin-top: 8px;
  margin-left: 56px;
  
  .translation-text {
    padding: 8px 12px;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    font-size: 13px;
    color: #666;
  }
  
  .message-main--mine & {
    margin-left: 0;
    margin-right: 56px;
  }
}

.message-send {
  background-color: #fff;
  padding: 12px 16px;
  border-top: 1px solid #eee;
  
  .message-send__btn {
    width: 100%;
    height: 40px;
    background-color: #07c160;
    color: #fff;
    border: none;
    border-radius: 6px;
  }
}

// 响应式适配
@media (max-width: 375px) {
  .message-main-item {
    padding: 0 50px;
  }
  
  .message-main-item__text {
    max-width: 75%;
  }
  
  .message-send {
    padding: 10px 12px;
  }
}
</style>
