<script>
import { mapActions } from 'vuex'
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
    ...mapActions([
      'toggleSidebar'
    ])
  },
  components: {}
}
</script>

<template lang="html">
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
</template>

<style lang="css">
</style>
