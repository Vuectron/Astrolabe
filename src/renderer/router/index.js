import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/views/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Layout
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
