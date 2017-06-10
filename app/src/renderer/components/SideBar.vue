<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Sidebar',
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
      menuVal: 'allStars'
    }
  },
  computed: {
    ...mapGetters({
      version: 'globalVersion'
    }),
    ...mapState({
      reposCount: state => state.github.reposCount,
      untaggedCount: state => state.github.untaggedCount,
      langGroup: state => state.github.langGroup
    }),
    searchVal: {
      get () {
        return this.$store.state.sidebar.searchQuery
      },
      set (val) {
        this.setSearchQuery(val)
      }
    }
  },
  methods: {
    handleMenuChange (val) {
      this.menuVal = val
      if (this.docked) {
        window.location.hash = this.menuVal
      } else {
        this.changeHref = true
      }
      this.$emit('change', val)
    },
    handleClose () {
      this.$emit('close')
    },
    handleHide () {
      if (!this.changeHref) return
      window.location.hash = this.menuVal
      this.changeHref = false
    },
    toggleSidebar () {
      this.$store.dispatch('toggleSidebar')
    },
    setSearchQuery (searchQuery) {
      return this.$store.dispatch('setSearchQuery', { searchQuery: searchQuery })
    },
    filterByLanguage (lang) {
      return this.$store.dispatch('filterByLanguage', { lang: lang })
    }
  },
  mounted () {
    console.log(this.version)
  }
}
</script>

<template>
  <mu-drawer class="app-drawer"
    @hide="handleHide" @close="handleClose" :open="open" :docked="docked" :zDepth="1">
    <mu-appbar class="sidebar-appbar" :zDepth="0">
      <mu-icon-button @click="toggleSidebar" icon="menu" slot="left"/>
      <mu-text-field class="appbar-search-field" slot="left" hintText="Search" v-model="searchVal"/>
    </mu-appbar>
    <mu-divider/>
    <mu-list :value="menuVal" @change="handleMenuChange">
      <mu-list-item title="All Stars" value="allStars" @click="filterByLanguage(null)">
        <mu-icon slot="left" value="grade"/>
        <mu-badge :content="reposCount" secondary slot="right"/>
      </mu-list-item>
      <mu-list-item title="Untagged Stars" value="untaggedStars" @click="filterByLanguage('null')">
        <mu-icon slot="left" value="bookmark_border"/>
        <mu-badge :content="untaggedCount" secondary slot="right"/>
      </mu-list-item>
    </mu-list>
    <mu-divider />
    <mu-list :value="menuVal" @change="handleMenuChange">
      <mu-list-item
        :title="group.lang"
        :value="group.lang"
        v-for="group in langGroup"
        v-if="group.count >= 5 && group.lang != 'null'"
        @click="filterByLanguage(group.lang)"
      >
        <!-- <mu-icon slot="left" value="grade"/> -->
        <div class="mu-item-left"><i :class="group.icon"></i> </div>
        <mu-badge :content="group.count" secondary slot="right"/>
      </mu-list-item>
    </mu-list>
  </mu-drawer>
</template>

<style lang="less">
@import "~muse-ui/less/vars.less";
.mu-drawer {
  &.open {
    min-width: 256px;
    width: 256px;
    .mu-item {
      min-height: 36px;
    }
  }
  min-width: 64px;
  width: 64px;
  transform: translate3d(0, 0, 0);
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  visibility: visible;
  .mu-appbar {
    .mu-text-field-content {
        padding-top: 12px;
    }
  }
  .mu-item {
    .mu-item-left {
      left: 20px;
    }
    .mu-item-content {
      white-space: nowrap;
    }
  }
  // .mu-item.selected {
  //   background: #eee;
  // }
}
.sidebar-appbar.mu-appbar {
  background-color: @primaryColor;
  color: @dialogBackgroundColor;
  .mu-icon-button {
    margin-right: 8px;
  }
}
.sidebar-appbar-title {
  color: @dialogBackgroundColor;
}
.sidebar-sub-header {
  padding-left: 34px;
}
.appbar-search-field {
  color: #fff;
  margin-bottom: 0;
  &.mu-text-field {
    width: 176px;
    &.has-icon {
      color: #fff;
    }
  }
  &.focus-state {
    color: #fff;
  }
  .mu-text-field-hint {
    color: fade(#fff, 54%);
  }
  .mu-text-field-input {
    color: #fff;
  }
  .mu-text-field-focus-line {
    background-color: #fff;
  }
}
</style>
