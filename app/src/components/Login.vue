<script>
  import GithubAuth from './GithubAuth'
  import MdlLoading from './mdl/MdlLoading'
  import DotLoader from 'vue-spinner/src/DotLoader.vue'
  import BounceLoader from 'vue-spinner/src/BounceLoader.vue'
  import storage from 'electron-json-storage'
  import request from 'superagent'
  import Github from 'github-api'
  import { isNull, isEmpty } from 'lodash'
  import db from '../services/db'

  export default {
    computed: {
      connecting () {
        return this.$store.state.login.connecting
      },
      loading () {
        return this.$store.state.login.loading
      },
      github () {
        return this.$store.state.github.github
      },
      repos () {
        return this.$store.state.github.repos
      },
      lazyRepos () {
        return this.$store.state.github.lazyRepos
      }
    },

    mounted () {
      this.getLocalToken()
    },

    methods: {
      toggleConnecting () {
        return this.$store.dispatch('toggleConnecting')
      },
      toggleLoading () {
        return this.$store.dispatch('toggleLoading')
      },
      toggleLogin () {
        return this.$store.dispatch('toggleLogin')
      },
      setToken (token) {
        return this.$store.dispatch('setToken', { token: token })
      },
      setGithub (github) {
        return this.$store.dispatch('setGithub', { github: github })
      },
      setUser (user) {
        return this.$store.dispatch('setUser', { user: user })
      },
      setRepos (repos) {
        return this.$store.dispatch('setRepos', { repos: repos })
      },
      setLangGroup (langGroup) {
        return this.$store.dispatch('setLangGroup', { langGroup: langGroup })
      },
      setLazyRepos (lazyRepos) {
        return this.$store.dispatch('setLazyRepos', { lazyRepos: lazyRepos })
      },
      initRepos (repos) {
        return this.$store.dispatch('initRepos', { repos: repos })
      },
      getLocalToken () {
        let self = this
        storage.get('oauth2', function (error, data) {
          if (data.token) {
            self.setToken(data.token)
            let github = new Github({
              token: data.token,
              auth: 'oauth'
            })
            self.setGithub(github)
            self.getUser(data.token)
          }
        })
      },
      getUser (token) {
        let self = this
        this.toggleConnecting()
        function callback (error, response) {
          if (!error && response.statusCode === 200) {
            let user = response.body
            self.setUser(user)
            self.getRepos(user)
          }
        }
        request.get('https://api.github.com/user')
          .accept('application/json')
          .auth('token', token)
          .end(callback)
      },
      getRepos (user) {
        let self = this
        this.toggleLoading()
        let githubUser = this.github.getUser(user.login)
        db.findOneUser(user.id).then(doc => {
          if (isNull(doc)) {
            githubUser.getStarredRepos(function (err, repos) {
              self.initRepos(repos)
            })
          } else {
            // fetch all repos into repos state
            db.fetchAllRepos().then(repos => {
              if (isEmpty(repos)) {
                githubUser.getStarredRepos(function (err, repos) {
                  self.initRepos(user, repos)
                })
              } else {
                self.setRepos(repos)
              }
            })
            db.fetchLangGroup().then(langGroup => {
              if (!isEmpty(langGroup)) {
                self.setLangGroup(langGroup)
              }
            })
          }
        })
        githubUser.getStarredRepos(function (err, repos) {
          self.initRepos(repos)
        })
        this.toggleLogin()
      }
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
    <div class="loading" v-if="connecting">
      <bounce-loader></bounce-loader>
      <span>Connecting ...</span>
    </div>
    <div class="login-form" v-else>
      <github-auth></github-auth>
    </div>
    <div class="loading" v-if="loading">
      <dot-loader color='#e91e63'></dot-loader>
      <span>Loading ...</span>
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
