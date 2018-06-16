<template>
  <transition name="fade" mode="out-in">
    <component :is="activeView" />
  </transition>
</template>

<script>
import Login from './login/index.vue'
import MainLayout from './main-layout/index.vue'

export default {
  name: 'Astrolabe',
  components: {
    Login,
    MainLayout
  },
  // data () {
  //   return {
  //     isLogin: true
  //   }
  // },
  computed: {
    isLogin () {
      return this.$store.state.auth.isLogin
    },
    activeView () {
      return this.isLogin ? 'main-layout' : 'login'
    }
  }
}
</script>

<style>
.fade-enter-active .fade-leave-active {
  transition: all .2s ease;
}

.fade-enter .fade-leave-active {
  opacity: 0;
}
</style>
