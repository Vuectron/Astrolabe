<script>
  import Login from './components/Login.vue'
  import Layout from './components/Layout.vue'

  export default {
    name: 'App',
    // data () {
    //   return {
    //     isLogin: true
    //   }
    // },
    computed: {
      isLogin () {
        return this.$store.state.auth.isLogin
      }
    },
    components: {
      Login,
      Layout
    }
  }
</script>

<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <login v-if="!isLogin"></login>
      <layout v-else></layout>
    </transition>
  </div>
</template>

<style lang='less'>
@import '~muse-ui/dist/muse-ui.css';
// @import '~muse-ui/dist/theme-teal.css';
@import '~material-design-icons/iconfont/material-icons.css';
@import '~highlight.js/styles/github.css';
@import '../../icons/devicon-2.2/devicon.min.css';
@import '../../icons/devicon-2.2/devicon-colors.css';
@import '~animate.css/animate.min.css';
@import '~roboto-fontface/css/roboto/roboto-fontface.css';

.fade-enter-active .fade-leave-active {
  transition: all .2s ease;
}

.fade-enter .fade-leave-active {
  opacity: 0;
}
</style>
