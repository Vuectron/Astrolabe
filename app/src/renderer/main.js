import Vue from 'vue'
import Electron from 'vue-electron'
import VueRouter from 'vue-router'
import MuseUI from 'muse-ui'
import App from './App'
import routes from './routes'
import store from './vuex/store'

Vue.use(Electron)
Vue.use(VueRouter)
Vue.use(MuseUI)
Vue.config.debug = true

const router = new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  ...App
}).$mount('#app')
