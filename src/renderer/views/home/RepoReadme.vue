<template>
  <section id="repos-readme" class="repos-readme" :style="{height: rightPaneHeight}">
    <div class="empty-placeholder" v-if="repoReadme.length == 0">
      No Repo Selected
    </div>
    <template v-else>
      <div class="progress-wrap" v-if="isLoadingReadme">
        <v-progress-circular
          indeterminate
          color="primary"
          :size="50"
        ></v-progress-circular>
      </div>
      <div class="article-wrap" v-else>
        <div class="repo-actions">
          <v-combobox
            v-model="activeTag"
            :filter="handleFilter"
            :hide-no-data="!search"
            :items="tagList"
            :search-input.sync="search"
            hide-selected
            label="Search for a tag"
            multiple
            small-chips
            solo>
            <template v-slot:no-data>
              <v-list-tile>
                <span class="subheading">Create</span>
                <v-chip
                  :color="`${colors[nonce - 1]} lighten-3`"
                  label
                  small
                >
                  {{ search }}
                </v-chip>
              </v-list-tile>
            </template>
            <template v-slot:selection="{ item, parent, selected }">
              <v-chip
                v-if="item === Object(item)"
                :text-color="item.colorIsLight ? 'black' : 'white'"
                :color="item.color"
                :selected="selected"
                label
                small
              >
                <span class="pr-2">
                  {{ item.text }}
                </span>
                <v-icon small @click="parent.selectItem(item)">close</v-icon>
              </v-chip>
            </template>
            <template v-slot:item="{ index, item }">
              <v-list-tile-content>
                <v-text-field
                  v-if="editing === item"
                  v-model="editing.text"
                  autofocus
                  flat
                  background-color="transparent"
                  hide-details
                  solo
                  @keyup.enter="onEditTag(index, item)"
                ></v-text-field>
                <v-chip
                  v-else
                  :text-color="item.colorIsLight ? 'black' : 'white'"
                  :color="item.color"
                  dark
                  label
                  small
                >
                  {{ item.text }}
                </v-chip>
              </v-list-tile-content>
              <v-spacer></v-spacer>
              <v-list-tile-action @click.stop>
                <v-btn icon @click.stop.prevent="onEditTag(index, item)">
                  <v-icon>{{ editing !== item ? 'edit' : 'check' }}</v-icon>
                </v-btn>
              </v-list-tile-action>
            </template>
          </v-combobox>
        </div>
        <article class="readme animated fadeIn" v-html="repoReadme" ref="repoReadme"></article>
      </div>
    </template>
    <speed-dial @toast="snackbar = true" />
    <v-snackbar
      v-model="snackbar"
      color="success"
      top
      :timeout="3000"
    >
      {{ snackbarTip }}
      <v-btn dark flat @click="snackbar = false" > Close </v-btn>
    </v-snackbar>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { shell } from 'electron'

import SpeedDial from './SpeedDial'

export default {
  name: 'RepoReadme',
  components: {
    SpeedDial
  },
  data: () => ({
    snackbar: false,
    snackbarTip: 'Repo clone link copied',
    // combobox
    activator: null,
    attach: null,
    editing: null,
    tagIndex: -1,
    nonce: 1,
    tagList: [],
    search: null
  }),
  computed: {
    ...mapState({
      tags: state => state.github.tags,
      repoReadme: state => state.content.repoReadme,
      isLoadingReadme: state => state.content.loadingReadme,
      selectedRepo: state => state.content.selectedRepo,
      activeRepo: state => state.content.activeRepo,
      rightPaneHeight: state => {
        const { windowSize } = state.global
        return `${windowSize.y - windowSize.toolbarHeight - 36}px`
      }
    }),
    activeTag: {
      get () {
        return this.activeRepo._tags || []
      },
      set (val) {
        this.setRepoTags({ tags: val })
      }
    },
    colors () {
      return this.tags.map(v => v.color)
    }
  },
  watch: {
    tags: {
      handler (val) {
        const tagHeading = { header: 'Select a tag or create one' }
        const tagList = this.tags.map(v => {
          return {
            id: v.id,
            text: v.name,
            color: v.color,
            colorIsLight: v.colorIsLight
          }
        })
        tagList.unshift(tagHeading)
        this.tagList = tagList
      },
      immediate: true
    },
    activeTag (val, prev) {
      if (val.length === prev.length) return

      val.map(v => {
        if (typeof v === 'string') {
          v = {
            text: v,
            color: this.colors[this.nonce - 1]
          }

          this.tagList.push(v)

          this.nonce++
        }

        return v
      })
    }
  },
  mounted () {
    // const self = this

    // $(document).ready(function () {
    //   // dealwith table style
    //   $('table').addClass('bordered striped')
    // })

    // // prevent default click action instead of execute openInBrowser()
    // $('.readme a').click(function (e) {
    //   e.preventDefault()
    //   const href = $(this).attr('href')
    //   if (href.match(/^[a-zA-Z]+:\/\//)) {
    //     self.openInBrowser(href)
    //   } else {
    //     // TODO dealwith wrong url
    //     console.log('[' + href + '] is a wrong url')
    //   }
    // })
  },
  methods: {
    ...mapActions(['setRepoTags']),
    openInBrowser (url) {
      shell.openExternal(url)
    },
    onEditTag (index, item) {
      if (!this.editing) {
        this.editing = item
        this.tagIndex = index
      } else {
        this.editing = null
        this.tagIndex = -1
      }
    },
    handleFilter (item, queryText, itemText) {
      if (item.header) return false

      const hasValue = val => val != null ? val : ''

      const text = hasValue(itemText)
      const query = hasValue(queryText)

      return text.toString()
        .toLowerCase()
        .indexOf(query.toString().toLowerCase()) > -1
    }
  }
}
</script>

<style lang="less">
@import url('../../assets/variables.less');

.repos-readme {
  overflow-y: auto;
  .empty-placeholder,
  .progress-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 2em;
  }
  .article-wrap {
    margin: 24px;
  }
  .readme {
    font-size: 16px;
    line-height: 1.5;
    word-wrap: break-word;
    padding: 32px;
    background-color: #fff;
    box-shadow: 0 0 5px rgba(0,0,0,.02), 0 5px 22px -8px rgba(0,0,0,.1);
    a {
      color: @primary--color;
      &:hover {
        color: @primary--hover--color;
        text-decoration: underline;
      }
    }
    img {
      max-width: 100%;
      height: auto;
      vertical-align: middle;
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-weight: 600;
      line-height: 1.25;
      margin-bottom: 16px;
      margin-top: 24px;
    }
    h1 {
      padding-bottom: 0.3em;
      font-size: 2em;
      line-height: 1.2;
      border-bottom: 1px solid #eee;
    }
    h2 {
      padding-bottom: 0.3em;
      font-size: 1.5em;
      border-bottom: 1px solid #eee;
    }
    h3 {
      font-size: 1.25em;
    }
    h4 {
      font-size: 1em;
    }
    blockquote,
    details,
    dl,
    ol,
    p,
    pre,
    table,
    ul {
      margin-bottom: 16px;
      margin-top: 0;
    }
    hr {
      background-color: #e1e4e8;
      border: 0;
      height: .25em;
      margin: 24px 0;
      padding: 0;
    }
    ul {
      padding-left: 2em;
      list-style-type: disc;
      li {
        list-style-type: disc;
      }
    }
    ul ul,
    ol ul {
      list-style-type: circle;
    }
    pre {
      position: relative;
      margin-bottom: 24px;
      border-radius: 3px;
      overflow: hidden;
      code {
        padding: 16px;
      }
    }
    code:not(.hljs) {
      background-color: #FCE4EC;
      color: #880E4F;
      padding: 0.2em .3em;
      font-family: Menlo, Monaco, Consolas, Courier, monospace;
      font-size: .8em;
      border-radius: .3em;
      line-height: normal;
    }
    blockquote {
      border-left: .25em solid #dfe2e5;
      color: #6a737d;
      padding: 0 1em;
    }
  }
}
</style>
