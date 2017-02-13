<script>
import { mapActions } from 'vuex'
import { ipcRenderer } from 'electron'
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
      title: 'Astrolabe',
      isOpen: false,
      trigger: null
    }
  },
  computed: {
    loadingRepos () {
      return this.$store.state.content.loadingRepos
    },
    user () {
      return this.$store.state.github.user
    }
  },
  watch: {},
  mounted () {
    this.trigger = this.$refs.button.$el
  },
  methods: {
    ...mapActions([
      'toggleSidebar'
    ]),
    exit () {
      ipcRenderer.send('exit', 'exit')
    },
    toggle () {
      this.isOpen = !this.isOpen
    },
    handleClose (e) {
      this.isOpen = false
    }
  }
}
</script>

<template lang="html">
  <div class="mu-appbar header-appbar" :class="{'nav-hide': !open}">
    <div class="left">
      <div class="brand-loading animated fadeIn" v-if="loadingRepos">
        <span class="loading-stars">Syncing Stars...</span>
      </div>
    </div>
    <div class="mu-appbar-title"><span v-text="title"></span></div>
    <div class="right">
      <mu-flat-button :label="user.login" class="demo-flat-button"
        labelPosition="before" icon="expand_more"
        ref="button" @click="toggle"/>
        <div class="userinfo">
          <img :src="user.avatar_url" :alt="user.login">
        </div>
      </mu-flat-button>
      <mu-popover :trigger="trigger" :open="isOpen" @close="handleClose">
        <mu-menu desktop>
          <mu-menu-item title="Profile" leftIcon="perm_contact_calendar"/>
          <mu-menu-item title="Settings" leftIcon="settings"/>
          <mu-divider />
          <mu-menu-item title="Exit" leftIcon="exit_to_app" @click="exit"/>
        </mu-menu>
      </mu-popover>
    </div>
  </div>
</template>

<style lang="css">
.brand-loading {
  position: absolute;
  display: inline-block;
  transform: translate3d(320px, 0, 0);
  transition: all 0.2s ease-in-out;
}

.brand-loading .v-spinner {
  float: right;
  margin: 16px;
}

.brand-loading span {
  height: 64px;
  line-height: 64px;
  display: inline-block;
  position: relative;
  color: #fff;
  opacity: .7;
}

.userinfo img {
  margin-left: 16px;
  width: 48px;
  height: 48px;
  float: left;
  border: 3px solid rgba(0, 0, 0, 0.14);
  border-radius: 50%;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.userinfo span {
  display: inline-block;
  height: 48px;
  line-height: 48px;
  font-size: 16px;
}
</style>
