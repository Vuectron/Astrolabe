<template>
  <div id="app" class="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style lang="less">
@import '~material-design-icons/iconfont/material-icons.css';
@import '~highlight.js/styles/github.css';
@import '~devicon/devicon.min.css';
// @import './assets/icons/devicon-2.2/devicon.min.css';
@import '~devicon/devicon-colors.css';
@import '~animate.css/animate.min.css';
#app {
  height: 100%;
  overflow: hidden;
}
</style>
