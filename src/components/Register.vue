<template>
  <div class="register">
    <!-- 导航栏 -->
    <van-nav-bar title="注册" left-arrow @click-left="$router.go(-1)" />

    <!-- 注册表单 -->
    <div class="register__form">
      <van-cell-group>
        <van-field
          v-model="forms.name"
          label="用户名"
          placeholder="请输入用户名"
          required
          clearable
          :error-message="errors.name"
        />
        <van-field
          v-model="forms.email"
          type="email"
          label="邮箱"
          placeholder="请输入邮箱地址"
          required
          clearable
          :error-message="errors.email"
        />
        <van-field
          v-model="forms.password"
          type="password"
          label="密码"
          placeholder="请输入密码（至少6位）"
          required
          clearable
          :error-message="errors.password"
        />
        <van-field
          v-model="forms.password_confirmation"
          type="password"
          label="确认密码"
          placeholder="请再次输入密码"
          required
          clearable
          :error-message="errors.password_confirmation"
        />
      </van-cell-group>

      <!-- 协议同意 -->
      <div class="register__agreement">
        <van-checkbox v-model="agreeTerms">
          我已阅读并同意
          <span class="link">《用户协议》</span>
          和
          <span class="link">《隐私政策》</span>
        </van-checkbox>
      </div>

      <!-- 注册按钮 -->
      <div class="register__btn">
        <van-button
          type="primary"
          :loading="loadingRegister"
          :disabled="disableRegister"
          size="large"
          @click="submit"
        >
          注册
        </van-button>
      </div>

      <!-- 登录链接 -->
      <div class="register__login--link">
        <router-link to="/login">登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import OAuth from '@/utils/oauth'

export default {
  name: 'Register',
  data() {
    return {
      forms: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      errors: {},
      loadingRegister: false,
      agreeTerms: false
    }
  },
  computed: {
    disableRegister() {
      return !this.forms.name || 
             !this.forms.email || 
             !this.forms.password || 
             !this.forms.password_confirmation ||
             !this.agreeTerms ||
             this.loadingRegister
    }
  },
  methods: {
    async submit() {
      // 清除之前的错误
      this.errors = {}
      
      // 表单验证
      if (!this.validateForm()) {
        return
      }

      this.loadingRegister = true

      try {
        const response = await this.$api.post('/register', this.forms)
        
        if (response.status === 200) {
          this.$toast.success('注册成功')
          // 自动登录
          const loginResult = await OAuth.request(this.forms.email, this.forms.password)
          if (loginResult) {
            this.$router.push('/home')
          } else {
            this.$router.push('/login')
          }
        } else if (response.status === 422) {
          // 处理验证错误
          this.handleValidationErrors(response.data)
        } else {
          this.$toast.fail('注册失败，请稍后重试')
        }
      } catch (error) {
        console.error('注册错误:', error)
        this.$toast.fail('注册失败，请稍后重试')
      } finally {
        this.loadingRegister = false
      }
    },

    validateForm() {
      let isValid = true

      // 用户名验证
      if (!this.forms.name) {
        this.errors.name = '请输入用户名'
        isValid = false
      } else if (this.forms.name.length < 2) {
        this.errors.name = '用户名至少2个字符'
        isValid = false
      }

      // 邮箱验证
      if (!this.forms.email) {
        this.errors.email = '请输入邮箱地址'
        isValid = false
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(this.forms.email)) {
          this.errors.email = '请输入有效的邮箱地址'
          isValid = false
        }
      }

      // 密码验证
      if (!this.forms.password) {
        this.errors.password = '请输入密码'
        isValid = false
      } else if (this.forms.password.length < 6) {
        this.errors.password = '密码至少6个字符'
        isValid = false
      }

      // 确认密码验证
      if (!this.forms.password_confirmation) {
        this.errors.password_confirmation = '请确认密码'
        isValid = false
      } else if (this.forms.password !== this.forms.password_confirmation) {
        this.errors.password_confirmation = '两次输入的密码不一致'
        isValid = false
      }

      return isValid
    },

    handleValidationErrors(errorData) {
      if (errorData.errors) {
        this.errors = {}
        Object.keys(errorData.errors).forEach(key => {
          this.errors[key] = errorData.errors[key][0]
        })
      } else if (errorData.error) {
        this.$toast.fail(errorData.error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.register {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.register__form {
  padding: 24px 16px;
}

.register__agreement {
  margin: 16px 0;
  padding: 0 16px;
  
  .link {
    color: #1989fa;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.register__btn {
  margin-top: 24px;
}

.register__login--link {
  text-align: center;
  margin-top: 16px;
  
  a {
    color: #1989fa;
    text-decoration: none;
    font-size: 14px;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

// 错误信息样式
.van-field__error-message {
  color: #ee0a24;
  font-size: 12px;
  margin-top: 4px;
}

// 响应式适配
@media (max-width: 375px) {
  .register__form {
    padding: 16px 12px;
  }
}
</style>
