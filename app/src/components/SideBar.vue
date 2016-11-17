<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: true
    },
    docked: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    handleClose () {
      this.$emit('close')
    },
    toggleSidebar () {
      this.$store.dispatch('toggleSidebar')
    }
  },
  mounted () {
    console.log(this.$store.state.global.version)
  }
}
</script>

<template>
<div>
  <mu-drawer @close="handleClose" :open="open" :docked="docked" class="app-drawer" :zDepth="1">
    <mu-appbar class="sidebar-appbar" :zDepth="0">
      <mu-icon-button @click="toggleSidebar" icon="menu" slot="left"/>
    </mu-appbar>
    <mu-divider/>
  </mu-drawer>
</div>
</template>

<style lang="less">
@import "~muse-ui/less/vars.less";
.sidebar-drawer{
  box-shadow: none;
  border-right: 1px solid @borderColor;
}
.sidebar-appbar.mu-appbar{
  background-color: @primaryColor;
  color: @dialogBackgroundColor;
}
.sidebar-appbar-title{
  color: @dialogBackgroundColor;
}
.sidebar-sub-header {
  padding-left: 34px;
}
</style>
