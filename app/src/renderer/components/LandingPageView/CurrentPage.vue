<template>
  <div class="">
    <p>
      You are currently at <code>`{{ $route.path }}`</code> on the <code>`{{ $route.name }}`</code> view.
    </p>
    <mu-appbar title="Title">
      <mu-icon-button icon='menu' slot="left"/>
      <mu-icon-button icon='expand_more' slot="right"/>
    </mu-appbar>
  </div>
</template>

<script>
  export default {
    created () {
      // Set $route values that are not preset during unit testing
      if (process.env.NODE_ENV === 'testing') {
        this.$route = {
          name: 'landing-page',
          path: '/landing-page'
        }
      }
    }
  }
</script>

<style scoped>
  code {
    background-color: rgba(40, 56, 76, .5);
    border-radius: 3px;
    color: #fff;
    font-weight: bold;
    padding: 3px 6px;
    margin: 0 3px;
    vertical-align: bottom;
  }

  p { line-height: 24px; }
</style>
