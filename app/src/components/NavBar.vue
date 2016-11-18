<script>
export default {
  name: 'NavBar',
  props: {
    open: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      title: 'Astrolabe'
    }
  },
  computed: {},
  mounted () {},
  methods: {
    toggleSidebar () {
      this.$store.dispatch('toggleSidebar')
    }
  },
  components: {}
}
</script>

<template lang="html">
  <div>
    <mu-appbar :zDepth="0" :title="title" class="header-appbar" :class="{'nav-hide': !open}">
      <mu-icon-button @click="toggleSidebar" icon="menu" slot="left"/>
      <mu-icon-menu icon="more_vert" slot="right">
        <mu-menu-item title="菜单 1"/>
        <mu-menu-item title="菜单 2"/>
        <mu-menu-item title="菜单 3"/>
        <mu-menu-item title="菜单 4"/>
        <mu-menu-item title="菜单 5"/>
      </mu-icon-menu>
    </mu-appbar>
  </div>
</template>

<style lang="css">
</style>
