<script>
  import GithubAuth from './GithubAuth'
  import MdlLoading from './mdl/MdlLoading'
  import DotLoader from 'vue-spinner/src/DotLoader.vue'
  import BounceLoader from 'vue-spinner/src/BounceLoader.vue'
  import { mapState, mapActions } from 'vuex'

  export default {
    computed: {
      ...mapState({
        isConnecting: state => state.auth.isConnecting,
        isLoading: state => state.auth.isLoading
      })
    },

    mounted () {
      this.getLocalToken()
        .then(() => {})
        .then(() => { this.getUser().then(user => user) })
        .then(user => { this.getRepos(user).then(() => {}) })
    },

    methods: {
      ...mapActions([
        'getLocalToken',
        'getUser',
        'getRepos'
      ])
    },

    components: {
      GithubAuth,
      MdlLoading,
      DotLoader,
      BounceLoader
    }
  }
</script>
<template>
  <div class="login-screen">
    <div class="loading" v-if="isLoading">
      <dot-loader color='#e91e63'></dot-loader>
      <span>Loading ...</span>
    </div>
    <div class="login-form" v-else>
      <github-auth></github-auth>
    </div>
    <div class="loading" v-if="isConnecting">
      <bounce-loader></bounce-loader>
      <span>Connecting ...</span>
    </div>
  </div>
</template>
<style media="screen">
  .login-screen {
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    background: #f857a6; /* fallback for old browsers */
    background: -webkit-linear-gradient(to left, #f857a6 , #e91e63); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #f857a6 , #e91e63); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    color: #fff;
  }

  .login-form {
    align-items: center;
    justify-content: center;
  }

  .loading {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: white;
    z-index: 1020;
  }

  .loading .v-spinner {
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    pointer-events: none;
    position: absolute;
    top: 50%;
    left: 50%;
    text-align: center;
    margin: -30px 0 0 -30px;
  }

  .loading span {
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    color: #658399;
    pointer-events: none;
    position: absolute;
    top: 55%;
    left: 0;
    text-align: center;
    width: 100%;
  }
</style>
