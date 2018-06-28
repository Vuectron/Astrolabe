<template>
  <mu-drawer
    class="app-drawer"
    :open="open"
    :docked="docked"
    :zDepth="1">
    <mu-appbar class="sidebar-appbar" :zDepth="0">
      <mu-button icon small color="primary" @click="toggleSidebar" slot="left">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      <mu-text-field
        slot="right"
        class="appbar-search-field"
        color="#fff"
        action-icon="search"
        placeholder="Search"
        v-model="searchVal"
        @change="handleChangeSearchVal"
      />
    </mu-appbar>
    <mu-list :value="menuVal" @change="handleMenuChange" :ripple="false">
      <mu-list-item button value="allStars" @click="filterByLanguage({lang: null})">
        <mu-list-item-action>
          <mu-icon value="star" color="pink"></mu-icon>
        </mu-list-item-action>
        <mu-list-item-title>All Stars</mu-list-item-title>
        <mu-list-item-action>
          <mu-badge :content="reposCount" color="secondary" />
        </mu-list-item-action>
      </mu-list-item>
      <mu-list-item button value="untaggedStars" @click="filterByLanguage({lang: 'null'})">
        <mu-list-item-action>
          <mu-icon value="bookmark_border" color="pink"></mu-icon>
        </mu-list-item-action>
        <mu-list-item-title>Untagged Stars</mu-list-item-title>
        <mu-list-item-action>
          <mu-badge :content="untaggedCount" color="secondary" />
        </mu-list-item-action>
      </mu-list-item>
    </mu-list>
    <mu-divider />
    <draggable v-model="langGroup" element="ul" :options="dragOptions" class="mu-list" @start="isSorted=true" @end="isSorted=false" @sort="handleSortTag">
      <li
        v-for="group in langGroup"
        v-if="group.count >= minLangCount && group.lang != 'null'"
        class="mu-list__langtag"
        :title="group.lang"
        :key="group.lang"
        @click="filterByLanguage({lang: group.lang})"
      >
        <a class="mu-item-wrapper" :class="{'hover': hoveredLink === group.lang}" @mouseover="handleHover(group.lang)" @mouseout="handleHover">
          <div class="mu-item" :class="{'is-selected': activeLang === group.lang}">
            <div class="mu-item-action">
              <div class="mu-item-left"><i class="mu-icon devicon" :class="[group.icon, {'colored': activeLang === group.lang}]"></i></div>
            </div>
            <div class="mu-item-title">{{group.lang}}</div>
            <div class="mu-item-action">
              <mu-badge :content="group.count + ''" color="secondary" />
            </div>
          </div>
        </a>
      </li>
    </draggable>
    <mu-divider/>
    <mu-flex justify-content="center" align-items="center">
      <mu-button full-width flat color="secondary" class="mu-flat-button-fullwidth" ref="addBtn" @click="isOpenDialog = !isOpenDialog">
        <mu-icon value="add"></mu-icon>
      </mu-button>
    </mu-flex>

    <mu-dialog title="Add Custom Tag" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="isOpenDialog">
      <mu-text-field v-model="tagName" label="Custom Tag Name" label-float full-width></mu-text-field>
      <mu-button slot="actions" flat color="primary" @click="handleCancel">Cancel</mu-button>
      <mu-button slot="actions" flat color="primary" @click="handleAddTag">Confrim</mu-button>
    </mu-dialog>
  </mu-drawer>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import Draggable from 'vuedraggable'

export default {
  name: 'Sidebar',
  components: {
    Draggable
  },
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
      dragOptions: {
        animation: 150,
        group: 'langTag',
        ghostClass: 'ghost'
      },
      isSorted: false,
      hoveredLink: '',
      isOpenDialog: false,
      trigger: null,
      tagName: ''
    }
  },
  computed: {
    ...mapGetters({
      version: 'globalVersion'
    }),
    ...mapState({
      minLangCount: state => state.global.minLangCount,
      reposCount: state => state.github.reposCount,
      untaggedCount: state => state.github.untaggedCount,
      activeLang: state => state.github.activeLang
    }),
    searchVal: {
      get () {
        return this.$store.state.sidebar.searchQuery
      },
      set (val) {
        this.setSearchQuery({ searchQuery: val })
      }
    },
    langGroup: {
      get () {
        return this.$store.state.github.langGroup
      },
      set (val) {
        this.setGithubState({ langGroup: val })
      }
    }
  },
  methods: {
    ...mapActions([
      'toggleSidebar',
      'setSearchQuery',
      'filterByLanguage',
      'setGithubState',
      'setLangGroup',
      'addLangGroup'
    ]),
    handleMenuChange (val) {
      this.menuVal = val
      if (this.docked) {
        window.location.hash = this.menuVal
      } else {
        this.changeHref = true
      }
      this.$emit('change', val)
    },
    handleHide () {
      if (!this.changeHref) return
      window.location.hash = this.menuVal
      this.changeHref = false
    },
    handleChangeSearchVal (val) {
      console.log(val)
    },
    handleHover (lang) {
      this.hoveredLink = lang
    },
    handleSortTag ({ oldIndex, newIndex }) {
      console.log(oldIndex, newIndex)
      this.setLangGroup()
    },
    handleAddTag () {
      this.addLangGroup(this.tagName)
      this.handleCancel()
    },
    handleCancel () {
      this.isOpenDialog = false
      this.tagName = ''
    }
  },
  mounted () {
    this.trigger = this.$refs.addBtn.$el
    console.log(this.version)
  }
}
</script>

<style lang="less">
.mu-drawer {
  &.is-open {
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
    padding: 0 20px;
    .devicon {
      font-size: 16px;
      padding: 4px;
    }
    .mu-item-left {
      left: 20px;
    }
    .mu-item-content {
      white-space: nowrap;
    }
  }
}
.sidebar-appbar.mu-appbar {
  background-color: #2196f3;
  color: #fff;
  padding: 0;
  .mu-appbar-left {
    padding: 0 16px;
  }
  .mu-appbar-title {
    display: none;
  }
}
.appbar-search-field {
  color: #fff;
  margin-bottom: 0;
  &.mu-input {
    width: 176px;
  }
  .mu-text-field {
    input {
      color: #fff;
    }
  }
}

// flat button with full width
.mu-flat-button-fullwidth {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
