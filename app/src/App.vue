<script>
  import store from 'src/vuex/store'

  export default {
    name: 'App',
    store
  }
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style>
  @import '~muse-ui/muse-ui.css';
  /*@import '~materialize-css/dist/css/materialize.css';*/
  @import url(https://fonts.googleapis.com/css?family=Lato:300);

  * {
    margin: 0;
    padding: 0;
  }

  html,
  body { height: 100%; }
</style>
