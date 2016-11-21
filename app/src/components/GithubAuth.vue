<script>
  import Github from 'github-api'
  import { remote } from 'electron'
  const BrowserWindow = remote.BrowserWindow
  import storage from 'electron-json-storage'
  import request from 'superagent'
  import { isNull, isEmpty } from 'lodash'
  import db from '../services/db'

  export default {
    data () {
      return {
        appName: 'Astrolabe',
        options: {
          client_id: 'd4a28554213774aa83cc',
          client_secret: 'a737f660e30ca4559069ec484658c45cb2a247a4',
          scope: ['user:email', 'public_repo']
        },
        isOpen: false
      }
    },

    computed: {
      github () {
        return this.$store.state.github.github
      }
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
      initRepos (repos) {
        return this.$store.dispatch('initRepos', { repos: repos })
      },
      githubAuth () {
        console.log('into github auth func')
        let self = this
        // Build the OAuth consent page URL
        let githubUrl = 'https://github.com/login/oauth/authorize?'
        let authUrl = githubUrl + 'client_id=' + this.options.client_id + '&scope=' + this.options.scope
        let authWindow = null

        // Open auth window
        authWindow = new BrowserWindow({
          width: 1024,
          height: 768,
          show: true,
          'web-preferences': {
            'node-integration': false
          }
        })

        authWindow.loadURL(authUrl)

        authWindow.webContents.on('will-navigate', function (event, url) {
          self.getCode(url, authWindow)
        })

        authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
          self.getCode(newUrl, authWindow)
        })

        // If "Done" button is pressed, hide "Loading"
        authWindow.on('close', function () {
          authWindow.destroy()
        })
      },
      getCode (url, authWindow) {
        let rawCode = /code=([^&]*)/.exec(url) || null
        let code = (rawCode && rawCode.length > 1) ? rawCode[1] : null
        let error = /\?error=(.+)$/.exec(url)
        if (code || error) {
          // Close the browser if code found or error
          authWindow.destroy()
        }

        // If there is a code, proceed to get token from github
        if (code) {
          console.log('code:' + code)
          this.code = code
          this.getToken(this.options, code)
          storage.set('oauth2', {
            code: code
          }, function (error) {
            if (error) throw error
          })
        } else if (error) {
          alert('Oops! Something went wrong and we couldn\'t' +
            'log you in using Github. Please try again.')
        }
      },
      getToken (option, code) {
        let self = this
        let postData = {
          client_id: option.client_id,
          client_secret: option.client_secret,
          code: code
        }
        function callback (error, response) {
          if (!error && response.statusCode === 200) {
            let info = response.body
            console.log('token:' + info.access_token)
            self.setToken(info.access_token)
            const github = new Github({
              token: info.access_token,
              auth: 'oauth'
            })
            self.setGithub(github)
            self.getUser(info.access_token)
            storage.set('oauth2', {
              code: code,
              token: info.access_token
            }, function (error) {
              if (error) throw error
            })
          }
        }
        request.post('https://github.com/login/oauth/access_token')
          .accept('application/json')
          .send(postData)
          .end(callback)
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
          self.initRepos(user, repos)
        })
        this.toggleLogin()
      }
    }
  }
</script>

<template>
  <div class="panel">
    <h2><span v-text="appName"></span></h2>
    <div class="formset">
      <button class="loginBtn" @click="githubAuth()">Log in with GitHub</button>
    </div>
  </div>
</template>
<style scoped>
*, *:after, *:before {
  box-sizing: border-box;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}

body {
  background: #2F3E9E;
  font-family: arial;
}

.panel {
  max-width: 360px;
  background: #fff;
  box-shadow: 0 -8px 0 -2px rgba(255, 255, 255, 0.7), 0 2px 5px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  color: #666;
  margin: auto;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 320px;
}
.panel h2 {
  margin: 25px 0 45px;
  display: inline-block;
  text-align: left;
  border-left: 3px solid;
  border-right: 3px solid;
  padding-left: 35px;
  width: 100%;
  font-size: 42px;
  font-weight: 200;
  color: #ED2553;
}
.panel a {
  text-decoration: none;
  color: #999;
  display: inline-block;
  margin-top: 35px;
}
.panel a:hover {
  color: #ED2553;
  text-decoration: underline;
}

.loginBtn {
  border: 1px solid #ED2553;
  padding: 12px 8px;
  width: 100%;
  margin-top: 15px;
  background: #fff;
  font-size: 18px;
  font-weight: 400;
  cursor: pointer;
  color: #ED2553;
  margin-bottom: 15px;
  position: relative;
  border-radius: 4px;
}
.loginBtn:hover {
  color: #fff;
  border-color: #fff;
  box-shadow: 0 -100px 0 0 #ED2553 inset;
}

.register-form {
  color: #fff;
  background: #ED2553;
  font-weight: 100;
  width: 72px;
  height: 72px;
  margin: 5px;
  padding: 0;
  border-radius: 100%;
  overflow: hidden;
  display: inline-block;
  cursor: pointer;
  left: 320px;
  top: 10px;
  position: absolute;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}
.register-form .close {
  -webkit-transition: 0.3s;
  transition: 0.3s;
  position: absolute;
  top: 15px;
  width: 50px;
  height: 50px;
  z-index: 2;
  right: 15px;
  font-size: 36px;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}
.register-form .formset, .register-form h2 {
  color: #fff;
  opacity: 0;
  position: relative;
  -webkit-transform: translateX(30px);
  transform: translateX(30px);
}
.register-form h2 {
  margin-bottom: 15px;
  -webkit-transform: translateY(30px);
  transform: translateY(30px);
}
.register-form .loginBtn {
  color: #ED2553;
  border-color: #fff;
}
.register-form .loginBtn:hover {
  color: #fff;
}
.register-form .form-group .form-label, .register-form .form-group .form-control {
  color: #fff;
}
.register-form .form-group.focus:after {
  background: #fff;
}
.register-form .form-group.focus .form-label, .register-form .form-group.filled .form-label {
  color: #fff;
}
.register-form.open {
  width: 100%;
  height: 100%;
  position: absolute;
  margin: 0;
  cursor: inherit;
  z-index: 50;
  left: 0;
  top: 0;
  border-radius: 8px;
  -moz-transition: width 0.2s 0.2S, height 0.15s 0.25s, border-radius 0.6s, left 0.3s, top 0.3s;
  -o-transition: width 0.2s 0.2S, height 0.15s 0.25s, border-radius 0.6s, left 0.3s, top 0.3s;
  -webkit-transition: width 0.2s 0.2S, height 0.15s, border-radius 0.6s, left 0.3s, top 0.3s;
  -webkit-transition-delay: 0s, 0.25s, 0s, 0s, 0s;
  -webkit-transition: width 0.2s 0.2S, height 0.15s 0.25s, border-radius 0.6s, left 0.3s, top 0.3s;
  transition: width 0.2s 0.2S, height 0.15s 0.25s, border-radius 0.6s, left 0.3s, top 0.3s;
}
.register-form.open .close {
  top: 5px;
  right: 0px;
  font-size: 32px;
  opacity: .7;
  cursor: pointer;
  z-index: 2;
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
.register-form.open .close:hover {
  opacity: 1;
}
.register-form.open .caption {
  font-size: 50px;
  margin: 50px auto 15px;
}
.register-form.open .formset, .register-form.open h2 {
  opacity: 1;
  -webkit-transform: translateY(0);
  transform: translateY(0);
  -moz-transition: -moz-transform 0.5s 0.55s, opacity 1s 0.55s;
  -o-transition: -o-transform 0.5s 0.55s, opacity 1s 0.55s;
  -webkit-transition: -webkit-transform 0.5s, opacity 1s;
  -webkit-transition-delay: 0.55s, 0.55s;
  -webkit-transition: opacity 1s 0.55s, -webkit-transform 0.5s 0.55s;
  transition: opacity 1s 0.55s, -webkit-transform 0.5s 0.55s;
  transition: transform 0.5s 0.55s, opacity 1s 0.55s;
  transition: transform 0.5s 0.55s, opacity 1s 0.55s, -webkit-transform 0.5s 0.55s;
}

.formset {
  padding: 25px;
  max-width: 320px;
  margin: auto;
}

.form-group {
  border-bottom: 1px solid #ddd;
  position: relative;
  margin-bottom: 25px;
}
.form-group:after {
  content: '';
  position: absolute;
  height: 2px;
  background: #ED2553;
  width: 0px;
  left: 0;
  right: 0;
  margin: auto;
  bottom: -2px;
  opacity: 0;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}
.form-group .form-control {
  border: none;
  height: 35px;
  position: relative;
  z-index: 2;
  padding: 5px;
  background: none;
  color: #ED2553;
  width: 100%;
}
.form-group .form-control:focus, .form-group .form-control:active {
  box-shadow: none;
  outline: none;
}
.form-group .form-label {
  font-weight: 300;
  color: #bbb;
  font-size: 14px;
  min-height: 17px;
  text-align: left;
  position: absolute;
  top: 10px;
  left: 5px;
  right: 0;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  z-index: 1;
}
.form-group.focus:after {
  opacity: 1;
  width: 100%;
  background: #ED2553;
}
.form-group.focus .form-label, .form-group.filled .form-label {
  top: -7px;
  font-size: 10px;
  color: #ED2553;
}
</style>
