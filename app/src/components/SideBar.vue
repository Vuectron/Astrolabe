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
      menuVal: 'allStars',
      searchVal: ''
    }
  },
  computed: {
    ...mapGetters({
      version: 'globalVersion'
    }),
    ...mapState({
      reposCount: state => state.github.reposCount,
      untaggedCount: state => state.github.untaggedCount,
      langGroup: state => state.github.langGroup,
      searchQuery: state => state.sidebar.searchQuery
    }),
    searchVal: {
      get () {
        return this.searchQuery
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
  <mu-drawer @hide="handleHide" @close="handleClose" :open="open" :docked="docked" class="app-drawer" :zDepth="1">
    <mu-appbar class="sidebar-appbar" :zDepth="0">
      <!-- <mu-icon-button @click="toggleSidebar" icon="menu" slot="left"/> -->
      <mu-text-field icon="search" class="appbar-search-field" slot="left" hintText="Search" v-model="searchVal"/>
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
      <mu-list-item :title="group.lang" :value="group.lang"
        v-for="group in langGroup"
        v-if="group.count >= 5 && group.lang != 'null'"
        @click="filterByLanguage(group.lang)">
        <mu-icon slot="left" value="grade"/>
        <mu-badge :content="group.count" secondary slot="right"/>
      </mu-list-item>
    </mu-list>
  </mu-drawer>
</template>

<style lang="less">
@import "~muse-ui/less/vars.less";
.sidebar-drawer{
  box-shadow: none;
  border-right: 1px solid @borderColor;
}
.sidebar-appbar.mu-appbar{
  background-color: @primaryColor;
  color: @dialogBackgroundColor;
}
.sidebar-appbar-title{
  color: @dialogBackgroundColor;
}
.sidebar-sub-header {
  padding-left: 34px;
}
.mu-item.selected {
  background: #eaeaea;
}
.appbar-search-field{
  color: #FFF;
  margin-bottom: 0;
  &.mu-text-field {
    width: 224px;
  }
  &.focus-state {
    color: #FFF;
  }
  .mu-text-field-hint {
    color: fade(#FFF, 54%);
  }
  .mu-text-field-input {
    color: #FFF;
  }
  .mu-text-field-focus-line {
    background-color: #FFF;
  }
}
</style>
