import Vue from 'vue'
import App from './App.vue'
import './plugins'
import vuetify from '@/plugins/vuetify'
import './assets/app.less'

import router from './router'
import store from './store'
import { createProvider } from './vue-apollo'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
