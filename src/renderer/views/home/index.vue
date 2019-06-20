<template>
  <v-app id="astrolabe" class="main-page" :dark="dark" v-resize="onResize">
    <v-navigation-drawer
      v-model="primaryDrawer.model"
      :clipped="primaryDrawer.clipped"
      :floating="primaryDrawer.floating"
      :mini-variant="primaryDrawer.mini"
      app
      absolute
      overflow
    >
      <side-bar />
    </v-navigation-drawer>
    <nav-bar :app-drawer="primaryDrawer" ref="navbar" />
    <v-content>
      <v-container fluid class="no-padding">
        <v-layout align-center justify-center>
          <splitpanes class="default-theme">
            <div
              class="left-pane"
              splitpanes-min="20px"
              splitpanes-max="33"
              :splitpanes-size="paneSize">
              <repo-desc />
            </div>
            <div class="right-pane" :splitpanes-size="100 - paneSize">
              <repo-readme />
            </div>
          </splitpanes>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer inset app>
      <span class="px-3">&copy; {{ new Date().getFullYear() }} Astrolabe </span>Made By ❤️<a href="http://xlbd.me">xlbd.me</a>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'

import NavBar from './NavBar'
import SideBar from './SideBar'
import RepoDesc from './RepoDesc'
import RepoReadme from './RepoReadme'

export default {
  name: 'home',
  components: {
    NavBar,
    SideBar,
    RepoDesc,
    RepoReadme
  },
  data: () => ({
    dark: false,
    primaryDrawer: {
      model: null,
      clipped: true,
      floating: false,
      mini: false
    },
    paneSize: 25,
    windowSize: {
      x: 0,
      y: 0,
      toolbarHeight: 0
    },
    items: [
      'Profile', 'Settings', 'Sign out', 'Exit'
    ]
  }),
  mounted () {
    this.onResize()
  },
  methods: {
    ...mapActions([
      'setGlobalState'
    ]),
    onResize () {
      const toolbarHeight = this.$refs.navbar.$el.offsetHeight
      this.windowSize = {
        x: window.innerWidth,
        y: window.innerHeight,
        toolbarHeight
      }
      this.setGlobalState({
        windowSize: this.windowSize
      })
    }
  }
}
</script>

<style lang="less" scoped>
.main-page {
  .container,
  .container .layout {
    height: 100%;
  }

  .splitpanes__pane {
    justify-content: center;
    align-items: center;
    display: flex;
    .left-pane,
    .right-pane {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
