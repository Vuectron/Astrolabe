<template>
  <v-toolbar color="primary" absolute dark>
    <!-- <v-toolbar-side-icon
      v-if="drawer.type !== 'permanent'"
      @click.stop="drawer.model = !drawer.model"
    /> -->
    <v-toolbar-title>Astrolabe</v-toolbar-title>

    <div class="search-wrapper">
      <v-text-field
        v-model="searchVal"
        flat
        solo-inverted
        prepend-inner-icon="search"
        label="Search"
        class="hidden-sm-and-down"
      ></v-text-field>
    </div>

    <v-spacer></v-spacer>

    <v-menu :nudge-width="80">
      <template v-slot:activator="{ on }">
        <v-toolbar-title v-on="on">
          <!-- user info -->
          <v-list class="toolbar-menu__user">
            <!-- <v-list-tile>
              <v-list-tile-avatar>
                <img :src="user.avatar_url">
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title v-text="user.login"></v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-icon dark>arrow_drop_down</v-icon>
              </v-list-tile-action>
            </v-list-tile> -->
          </v-list>
        </v-toolbar-title>
      </template>

      <!-- menu list -->
      <v-list>
        <!-- Profile -->
        <v-list-tile @click="onClickMenu">
          <v-list-tile-action>
            <v-icon color="blue darken-2">perm_contact_calendar</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>Profile</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!-- Settings -->
        <v-list-tile @click="onClickMenu">
          <v-list-tile-action>
            <v-icon color="blue darken-2">settings</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!-- Sign out -->
        <v-list-tile @click="handleSignout">
          <v-list-tile-action>
            <v-icon color="blue darken-2">exit_to_app</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>Sign out</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <!-- Exit -->
        <v-list-tile @click="handleExit">
          <v-list-tile-action>
            <v-icon color="blue darken-2">power_settings_new</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>Exit</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-dialog v-model="isOpenDialog" max-width="320">
      <v-card>
        <v-card-title class="headline">Sign Out</v-card-title>

        <v-card-text>
          Are you sure you want sign out Astrolabe?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" flat="flat" @click="isOpenDialog = false">
            No
          </v-btn>

          <v-btn color="blue darken-1" flat="flat" @click="isOpenDialog = false" >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-toolbar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'

export default {
  name: 'NavBar',
  props: {
    appDrawer: Object
  },
  data () {
    return {
      drawer: this.appDrawer,
      isOpenDialog: false
    }
  },
  computed: {
    ...mapGetters(['user']),
    searchVal: {
      get () {
        return this.$store.state.github.searchQuery
      },
      set (val) {
        this.handleSearch(val)
      }
    }
  },
  methods: {
    ...mapActions(['userSignout', 'setSearchQuery']),
    onClickMenu (val) {
      console.log('click menu ' + val)
    },
    async handleSignout () {
      // await this.userSignout()
      this.toggleDialogOpen()
      // ipcRenderer.send('signout', 'signout')
    },
    toggleDialogOpen () {
      this.isOpenDialog = !this.isOpenDialog
    },
    handleExit () {
      // ipcRenderer.send('exit', 'exit')
    },
    handleSearch: _.debounce(function (val) {
      this.setSearchQuery({ searchQuery: val })
    }, 333)
  }
}
</script>

<style lang="less" scoped>
.main-page {
  .toolbar-menu__user {
    background: transparent;
    .v-list__tile__action {
      min-width: 32px;
    }
  }
  .search-wrapper {
    position: absolute;
    left: 300px;
    width: 600px;
    margin-top: 4px;
  }
}
</style>
