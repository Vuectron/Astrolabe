<script>
  import Login from './components/Login.vue'
  import Layout from './components/Layout.vue'

  export default {
    name: 'App',
    data () {
      return {
        isLogin: true
      }
    },
    // computed: {
    //   isLogin () {
    //     return this.$store.state.login.isLogin
    //   }
    // },
    components: {
      Login,
      Layout
    }
  }
</script>

<template>
  <div id="app">
    <div class="login animated fadeIn" v-if="!isLogin">
      <login></login>
    </div>
    <div class="animated fadeIn" v-else>
      <layout></layout>
    </div>
  </div>
</template>

<style lang='less'>
@import '~muse-ui/dist/muse-ui.css';
@import '~muse-ui/dist/theme-teal.css';
@import '~material-design-icons/iconfont/material-icons.css';
</style>
