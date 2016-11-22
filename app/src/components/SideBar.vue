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
      value: ''
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
    })
  },
  methods: {
    handleChange (val) {
      this.value = val
    },
    toggleSidebar () {
      this.$store.dispatch('toggleSidebar')
    },
    setSearchQuery (searchQuery) {
      return this.$store.dispatch('setSearchQuery', { searchQuery: searchQuery })
    },
    filterByLanguage (lang) {
      return this.$store.dispatch('filterByLanguage', { searchQuery: lang })
    }
  },
  mounted () {
    console.log(this.version)
    console.log(this.$store.state)
    console.log(this.langGroup)
  }
}
</script>

<template>
  <mu-drawer :open="open" :docked="docked" class="app-drawer" :zDepth="1">
    <mu-appbar class="sidebar-appbar" :zDepth="0">
      <!-- <mu-icon-button @click="toggleSidebar" icon="menu" slot="left"/> -->
      <mu-text-field icon="search" class="appbar-search-field" slot="left" hintText="Search"/>
    </mu-appbar>
    <mu-divider/>
    <mu-list :value="value" @change="handleChange">
      <mu-list-item title="All Stars" value="allStars" @click="setSearchQuery('')">
        <mu-icon slot="left" value="grade"/>
        <mu-badge :content="reposCount" secondary slot="right"/>
      </mu-list-item>
      <mu-list-item title="Untagged Stars" value="untaggedStars" @click="filterByLanguage('null')">
        <mu-icon slot="left" value="bookmark_border"/>
        <mu-badge :content="untaggedCount" secondary slot="right"/>
      </mu-list-item>
    </mu-list>
    <mu-divider />
    <mu-list :value="value" @change="handleChange">
      <mu-list-item :title="group.lang" :value="group.lang"
        v-for="group in langGroup"
        v-if="group.count >= 5 && group.lang != 'null'"
        @click="filterByLanguage(group.lang)">
        <mu-icon slot="left" value="grade"/>
        <mu-badge :content="group.count" secondary slot="right"/>
      </mu-list-item>
      <!-- <div tabindex="0" class="mu-item-wrapper" style="-webkit-user-select: none; outline: none; cursor: pointer; -webkit-appearance: none;"
        v-for="group in langGroup">
          <div style="margin-left: 0px;">
              <div class="mu-ripple-wrapper"></div>
              <div class="mu-item show-left show-right">
                  <div class="mu-item-left"><i aria-hidden="true" class="mu-icon material-icons inbox" style="font-size: 24px; width: 24px; height: 24px;">inbox</i> </div>
                  <div class="mu-item-content" v-text="group.lang">
                  </div>
                  <div class="mu-item-right">
                      <div class="mu-badge-container">
                      	<em class="mu-badge mu-badge-secondary">
            							<span v-text="group.count"></span>
            						</em>
            					</div>
                  </div>
              </div>
          </div>
      </div> -->
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
