<template>
  <transition name="fade" mode="out-in">
    <component :is="activeView" />
  </transition>
</template>

<script>
import Login from './login/index.vue'
import Home from './home/index.vue'

export default {
  name: 'Astrolabe',
  components: {
    Login,
    Home
  },
  computed: {
    isLogin () {
      return true
    },
    activeView () {
      return this.isLogin ? 'home' : 'login'
    }
  }
}
</script>

<style lang="less" scoped>
.fade-enter-active .fade-leave-active {
  transition: all .2s ease;
}

.fade-enter .fade-leave-active {
  opacity: 0;
}
</style>
