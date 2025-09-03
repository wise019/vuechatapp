<template>
  <div id="app">
    <transition :name="direction" mode="out-in">
      <router-view />
    </transition>
    
    <!-- 底部导航栏 -->
    <van-tabbar
      v-if="showTabbar"
      v-model="activeTab"
      @change="onTabChange"
      active-color="#07c160"
      inactive-color="#000"
    >
      <van-tabbar-item icon="wap-home-o" to="/home">{{ $t('tab.home') }}</van-tabbar-item>
      <van-tabbar-item icon="chat-o" to="/message">{{ $t('tab.message') }}</van-tabbar-item>
      <van-tabbar-item icon="friends-o" to="/my">{{ $t('tab.my') }}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  data() {
    return {
      activeTab: 0
    }
  },
  computed: {
    ...mapState(['direction']),
    showTabbar() {
      const route = this.$route
      return route.meta && route.meta.tabbar
    }
  },
  methods: {
    onTabChange(index) {
      this.activeTab = index
    }
  },
  watch: {
    $route(to) {
      // 根据路由更新活跃tab
      if (to.path === '/home') this.activeTab = 0
      else if (to.path === '/message') this.activeTab = 1  
      else if (to.path === '/my') this.activeTab = 2
    }
  }
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  background-color: #f7f8fa;
}

#app {
  min-height: 100vh;
}

// 路由过渡动画
.forward-enter-active,
.forward-leave-active,
.reverse-enter-active,
.reverse-leave-active {
  transition: all 0.3s ease;
}

.forward-enter,
.reverse-leave-to {
  transform: translateX(100%);
}

.forward-leave-to,
.reverse-enter {
  transform: translateX(-100%);
}

// 响应式设计
@media (max-width: 375px) {
  body {
    font-size: 14px;
  }
}
</style>
