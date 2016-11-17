export default [
  {
    path: '/',
    name: 'Main',
    component: require('components/Main')
  },
  {
    path: '*',
    redirect: '/'
  }
]
