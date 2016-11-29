<script>
import { mapActions } from 'vuex'
import { ipcRenderer } from 'electron'
import { MoonLoader } from 'vue-spinner/dist/vue-spinner.min.js'
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
  },
  methods: {
    ...mapActions([
      'toggleSidebar'
    ]),
    exit () {
      ipcRenderer.send('exit', 'exit')
    }
  },
  components: {
    MoonLoader
  }
}
</script>

<template lang="html">
  <div class="mu-appbar header-appbar" :class="{'nav-hide': !open}">
    <div class="left">
      <div class="brand-loading animated fadeIn" v-if="loadingRepos">
        <moon-loader :loading="true" color="#fff" size="32px"></moon-loader>
        <span class="loading-stars">Syncing Stars...</span>
      </div>
    </div>
    <div class="mu-appbar-title"><span v-text="title"></span></div>
    <div class="right">
      <div class="userinfo">
        <img :src="user.avatar_url" :alt="user.login">
        <span v-text="user.login"></span>
      </div>
      <mu-icon-menu icon="more_vert" slot="right">
        <mu-menu-item title="Profile" leftIcon="perm_contact_calendar"/>
        <mu-menu-item title="Settings" leftIcon="settings"/>
        <mu-divider />
        <mu-menu-item title="Exit" leftIcon="exit_to_app" @click="exit"/>
      </mu-icon-menu>
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
  margin-left: 16px;
  font-size: 16px;
}
</style>
