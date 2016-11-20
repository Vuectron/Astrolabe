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
  <mu-drawer @close="handleClose" :open="open" :docked="docked" class="app-drawer" :zDepth="1">
    <mu-appbar class="sidebar-appbar" :zDepth="0">
      <!-- <mu-icon-button @click="toggleSidebar" icon="menu" slot="left"/> -->
      <mu-text-field icon="search" class="appbar-search-field" slot="left" hintText="Search"/>
    </mu-appbar>
    <mu-divider/>
    <mu-list>
      <mu-list-item title="All Stars">
        <mu-icon slot="left" value="grade"/>
        <mu-badge content="1001" secondary slot="right"/>
      </mu-list-item>
      <mu-list-item title="Untagged Stars">
        <mu-icon slot="left" value="bookmark_border"/>
        <mu-badge content="188" secondary slot="right"/>
      </mu-list-item>
    </mu-list>
    <mu-divider />
    <mu-list>
      <mu-list-item title="All mail">
        <mu-icon slot="left" value="inbox"/>
        <mu-badge content="188" secondary slot="right"/>
      </mu-list-item>
      <mu-list-item title="Trash">
        <mu-icon slot="left" value="inbox"/>
        <mu-badge content="188" secondary slot="right"/>
      </mu-list-item>
      <mu-list-item title="Spam">
        <mu-icon slot="left" value="inbox"/>
        <mu-badge content="188" secondary slot="right"/>
      </mu-list-item>
      <mu-list-item title="Follow up">
        <mu-icon slot="left" value="inbox"/>
        <mu-badge content="188" secondary slot="right"/>
      </mu-list-item>
    </mu-list>
  </mu-drawer>
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
.appbar-search-field{
  color: #FFF;
  margin-bottom: 0;
  &.mu-text-field {
    width: 224px;
  }
  &.focus-state {
    color: #FFF;
  }
  .mu-text-field-hint {
    color: fade(#FFF, 54%);
  }
  .mu-text-field-input {
    color: #FFF;
  }
  .mu-text-field-focus-line {
    background-color: #FFF;
  }
}
</style>
