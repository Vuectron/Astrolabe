<script>
  import Login from './components/Login.vue'
  import Main from './components/Main.vue'

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
      Main
    }
  }
</script>

<template>
  <div id="app">
    <div class="login animated fadeIn" v-if="!isLogin">
      <login></login>
    </div>
    <div class="animated fadeIn" v-else>
      <main></main>
    </div>
  </div>
</template>

<style lang='less'>
@import '~muse-ui/dist/muse-ui.css';
@import '~muse-ui/dist/theme-teal.css';
@import '~material-design-icons/iconfont/material-icons.css';
</style>
