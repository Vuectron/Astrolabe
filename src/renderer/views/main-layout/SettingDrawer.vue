<template>
  <mu-drawer :open.sync="openSettingDrawer" docked :right="true" width="384">
    <mu-appbar color="primary">
      <mu-button icon slot="right" @click="$emit('close')">
        <mu-icon value="close"></mu-icon>
      </mu-button>
      Settings
    </mu-appbar>
    <mu-list>
      <mu-sub-header>Tag setting</mu-sub-header>
      <mu-list-item button :ripple="false" @click="autoTag = !autoTag">
        <mu-list-item-title>
          Use language as default tags
        </mu-list-item-title>
        <mu-list-item-action>
          <mu-switch v-model="autoTag" readonly></mu-switch>
        </mu-list-item-action>
      </mu-list-item>
      <mu-list-item>
        <mu-list-item-title>
          Minimum count
        </mu-list-item-title>
        <mu-list-item-action>
          <mu-slider class="min-counts" :step="10" v-model="minCounts"></mu-slider>
        </mu-list-item-action>
      </mu-list-item>
    </mu-list>
    <mu-list>
      <mu-sub-header>Theme setting</mu-sub-header>
      <mu-list-item button :ripple="false" @click="defaultTheme = !defaultTheme">
        <mu-list-item-action>
          <mu-checkbox v-model="defaultTheme" readonly></mu-checkbox>
        </mu-list-item-action>
        <mu-list-item-title>
          Default
        </mu-list-item-title>
      </mu-list-item>
    </mu-list>
  </mu-drawer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      openSettingDrawer: false,
      autoTag: false,
      defaultTheme: false,
      minCounts: 10
    }
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  watch: {
    isOpen (val) {
      this.openSettingDrawer = val
    }
  }
}
</script>

<style>

</style>
