import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/views/index.vue'
// import Content from '@/views/home-bak/Content.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Layout
      // redirect: {
      //   name: 'Content'
      // },
      // children: [
      //   {
      //     path: '/content',
      //     name: 'Content',
      //     component: Content
      //   }
      // ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
