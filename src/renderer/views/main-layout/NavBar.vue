<template>
  <mu-appbar class="header-appbar" color="primary" :class="{'nav-hide': !open}">
    <div class="left" slot="left">
      <div class="brand-loading animated fadeIn" v-if="loadingRepos">
        <span class="loading-stars">Syncing Stars...</span>
      </div>
      <div class="mu-appbar-title"><span v-text="title"></span></div>
    </div>
    <mu-menu slot="right" placement="bottom-end">
      <mu-button flat ref="popoverButton" @click="toggleOpen">
        <div class="userinfo">
          <span v-text="user.login"></span>
          <img :src="user.avatar_url" :alt="user.login">
        </div>
      </mu-button>
      <mu-popover :trigger="trigger" :open.sync="isOpen" @close="handleClose">
        <mu-list>
          <mu-list-item button>
            <mu-list-item-action>
              <mu-icon value="perm_contact_calendar"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>Profile</mu-list-item-title>
          </mu-list-item>
          <mu-list-item button>
            <mu-list-item-action>
              <mu-icon value="settings"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>Settings</mu-list-item-title>
          </mu-list-item>
          <mu-divider />
          <mu-list-item button @click="toggleDailogOpen">
            <mu-list-item-action>
              <mu-icon value="exit_to_app"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>Sign out</mu-list-item-title>
          </mu-list-item>
          <mu-list-item button @click="handleExit">
            <mu-list-item-action>
              <mu-icon value="power_settings_new"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>Exit</mu-list-item-title>
          </mu-list-item>
        </mu-list>
      </mu-popover>
      <mu-dialog :open="isOpenDialog" :title="dialogTitle" @close="toggleDailogOpen" dialogClass="signout-dailog">
        Are you sure you want sign out Astrolabe?
        <mu-button flat slot="actions" primary @click="toggleDailogOpen">No</mu-button>
        <mu-button flat slot="actions" primary @click="handleSignout">Yes</mu-button>
      </mu-dialog>
    </mu-menu>
  </mu-appbar>
</template>

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
      isOpenDialog: false,
      trigger: null,
      dialogTitle: 'Sign out'
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
  methods: {
    ...mapActions([
      'toggleSidebar',
      'userSignout'
    ]),
    handleSignout () {
      this.userSignout()
        .then(() => {
          console.log('send ipc signout')
          this.toggleDailogOpen()
          ipcRenderer.send('signout', 'signout')
        })
    },
    handleExit () {
      ipcRenderer.send('exit', 'exit')
    },
    toggleOpen () {
      this.isOpen = !this.isOpen
    },
    toggleDailogOpen () {
      this.isOpenDialog = !this.isOpenDialog
    },
    handleClose (e) {
      this.isOpen = false
    }
  },
  mounted () {
    this.trigger = this.$refs.popoverButton.$el
  }
}
</script>

<style lang="less">
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

.userinfo {
  span {
    display: inline-block;
    height: 48px;
    line-height: 48px;
    padding-right: 16px;
    font-size: 16px;
  }
  img {
    width: 48px;
    height: 48px;
    float: right;
    border: 3px solid rgba(0, 0, 0, 0.14);
    border-radius: 50%;
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }
} 

.signout-dailog {
  width: 480px;
}
</style>
