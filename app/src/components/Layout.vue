<script>
  import NavBar from './NavBar.vue'
  import SideBar from './SideBar.vue'

  const isDesktop = () => window.innerWidth > 993

  export default {
    name: 'Layout',
    data () {
      return {
        title: '',
        docked: isDesktop(),
        desktop: isDesktop()
      }
    },
    computed: {
      open () {
        return this.$store.state.sidebar.open
      },
      isDesktop () {
        return window.innerWidth > 993
      }
    },
    watch: {
      open (newVal) {
        console.log(newVal)
      },
      isDesktop (newVal) {
        console.log(newVal)
      }
    },
    mounted () {
      this.$store.dispatch('setSidebar', { isDesktop: isDesktop() })
      this.routes = this.$router.options.routes
      this.setTitle()
      this.resizeSidebar()
      this.handleResize = () => {
        this.resizeSidebar()
      }
      window.addEventListener('resize', this.handleResize)
      window.addEventListener('hashchange', () => {
        this.setTitle()
      })
    },
    methods: {
      toggleSidebar () {
        this.$store.dispatch('toggleSidebar')
      },
      resizeSidebar () {
        const desktop = isDesktop()
        console.log('resizeSidebar:' + desktop)
        this.docked = desktop
        if (desktop === this.desktop) return
        if (!desktop && this.desktop && this.open) {
          this.$store.dispatch('setSidebar', { isDesktop: false })
        }
        if (desktop && !this.desktop && !this.open) {
          this.$store.dispatch('setSidebar', { isDesktop: true })
        }
        this.desktop = desktop
      },
      handleMenuChange (path) {
        if (!this.desktop) this.$store.dispatch('setSidebar', { isDesktop: false })
      },
      setTitle () {
        let path = window.location.hash
        if (path && path.length > 1) path = path.substring(1)
        for (let i = 0; i < this.routes.length; i++) {
          var route = this.routes[i]
          if (route.path === path) {
            this.title = route.title || ''
            return
          }
        }
      }
    },
    destroyed () {
      window.removeEventListener('resize', this.handleResize)
    },
    components: {
      NavBar,
      SideBar
    }
  }
</script>

<template>
  <div class="animated">
    <header class="header">
      <nav-bar :open="open" />
    </header>
    <main>
      <aside class="sidebar">
        <side-bar @change="handleMenuChange" @close="toggleSidebar" :open="open" :docked="docked" />
      </aside>
      <main class="wrapper" :class="{'nav-hide': !open}">
        <router-view></router-view>
      </main>
    </main>
  </div>
</template>

<style lang="less">
@import '~muse-ui/less/vars.less';
@import '~muse-ui/less/mixins.less';
.header-appbar {
  position: fixed;
  left: 256px;
  right: 0;
  top: 0;
  width: auto;
  transition: all .45s @easeOutFunction;
  &.nav-hide {
    left: 64px;
    // left: 0;
  }
}
.wrapper {
  padding-top: 56px;
  padding-left: 256px;
  transition: all .45s @easeOutFunction;
  &.nav-hide {
    padding-left: 64px;
    // padding-left: 0;
  }
  .repos-desc {
    left: 256px;
    transition: all .45s @easeOutFunction;
  }
  .repos-readme {
    left: 576px;
    transition: all .45s @easeOutFunction;
  }
  .showbox {
    left: 576px;
    transition: all .45s @easeOutFunction;
  }
  &.nav-hide .repos-desc {
    left: 64px;
    // left: 0;
  }
  &.nav-hide .repos-readme {
    left: 384px;
    // left: 320px;
  }
  &.nav-hide .showbox {
    left: 384px;
    // left: 320px;
  }
}
@media (min-width: 480px) {
  .wrapper {
    padding-top: 64px;
  }
}
@media (max-width: 993px) {
  .header-appbar {
    left: 256px;
    &.nav-hide {
      left: 64px;
      // left: 0;
    }
  }
  .wrapper {
    padding-left: 0;
  }
}
</style>
