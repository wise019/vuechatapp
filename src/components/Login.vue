<template>
  <div class="login">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" left-arrow @click-left="$router.go(-1)" />

    <!-- 登录表单 -->
    <div class="login__form">
      <van-cell-group>
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
          placeholder="请输入密码"
          required
          clearable
          :error-message="errors.password"
        />
      </van-cell-group>

      <!-- 登录按钮 -->
      <div class="login__btn">
        <van-button
          type="primary"
          :loading="loadingLogin"
          :disabled="disableLogin"
          size="large"
          @click="submit"
        >
          登录
        </van-button>
      </div>

      <!-- 注册链接 -->
      <div class="login__register--link">
        <router-link to="/register">注册</router-link>
      </div>

      <!-- 忘记密码 -->
      <div class="login__forgot">
        <van-button type="default" plain size="small">
          忘记密码？
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      forms: {
        email: '',
        password: ''
      },
      errors: {},
      loadingLogin: false
    }
  },
  computed: {
    disableLogin() {
      return !this.forms.email || !this.forms.password || this.loadingLogin
    }
  },
  methods: {
    ...mapActions(['login']),

    async submit() {
      // 清除之前的错误
      this.errors = {}
      
      // 简单验证
      if (!this.forms.email) {
        this.errors.email = '请输入邮箱地址'
        return
      }
      
      if (!this.forms.password) {
        this.errors.password = '请输入密码'
        return
      }

      // 邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.forms.email)) {
        this.errors.email = '请输入有效的邮箱地址'
        return
      }

      this.loadingLogin = true

      try {
        const result = await this.login({
          email: this.forms.email,
          password: this.forms.password
        })

        if (result && result.success) {
          this.$toast.success('登录成功')
          this.$router.push('/home')
        } else {
          const message = result && result.message ? result.message : '登录失败，请检查邮箱和密码'
          this.$toast.fail(message)
        }
      } catch (error) {
        console.error('登录错误:', error)
        this.$toast.fail('登录失败，请稍后重试')
      } finally {
        this.loadingLogin = false
      }
    },
  }
}
</script>

<style lang="less" scoped>
.login {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.login__form {
  padding: 24px 16px;
}

.login__btn {
  margin-top: 32px;
}

.login__register--link {
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

.login__forgot {
  text-align: center;
  margin-top: 24px;
}

// 错误信息样式
.van-field__error-message {
  color: #ee0a24;
  font-size: 12px;
  margin-top: 4px;
}

// 响应式适配
@media (max-width: 375px) {
  .login__form {
    padding: 16px 12px;
  }
}
</style>
