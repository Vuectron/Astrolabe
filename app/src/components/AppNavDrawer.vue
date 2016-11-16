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
    }
  },
  mounted () {

  }
}
</script>

<template>
<div>
  <mu-drawer @close="handleClose" :open="open" :docked="docked" class="app-drawer" :zDepth="1">
    <mu-appbar class="exmaples-nav-appbar" :zDepth="0">
      <!-- <mu-icon-button @click="open = !open" icon="menu" slot="left"/> -->
    </mu-appbar>
    <mu-divider/>
  </mu-drawer>
</div>
</template>

<style lang="less">
@import "~muse-ui/less/vars.less";
.exmaples-drawer{
  box-shadow: none;
  border-right: 1px solid @borderColor;
}
.exmaples-nav-appbar.mu-appbar{
  background-color: @primaryColor;
  color: @secondaryTextColor;
}
.exmaples-appbar-title{
  color: @secondaryTextColor;
}
.exmaples-version {
  margin-left: 10px;
  align-self: flex-start;
}
.exmaples-nav-sub-header {
  padding-left: 34px;
}
.mu-version-box{
  height: 48px;
  margin-top: 8px;
  padding-left: 16px;
  padding-right: 16px;
}
.mu-version-text {
  font-size: 16px;
  margin-top: 8px;
}
</style>
