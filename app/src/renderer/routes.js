export default [
  {
    path: '/',
    name: 'Content',
    component: require('components/Content')
  },
  {
    path: '*',
    redirect: '/'
  }
]
