<template>
  <div id="repos-desc" class="repos-desc animated fadeIn">
    <div class="repos-desc__header">
      <!-- Use bottom-nav as top-nav -->
      <v-bottom-nav
        :active.sync="activeTopNav"
        :value="true"
        class="as-top-nav"
        color="transparent">
        <v-btn color="teal" flat value="time" @click="orderedRepos('starred_at')">
          <span>Time</span>
          <v-icon>schedule</v-icon>
        </v-btn>
        <v-btn color="teal" flat value="owner" @click="orderedRepos('owner_name')">
          <span>Owner</span>
          <v-icon>person</v-icon>
        </v-btn>
        <v-btn color="teal" flat value="repo" @click="orderedRepos('repo_name')">
          <span>Repo</span>
          <v-icon>archive</v-icon>
        </v-btn>
        <v-btn color="teal" flat value="star" @click="orderedRepos('stargazers_count')">
          <span>Star</span>
          <v-icon>star</v-icon>
        </v-btn>
      </v-bottom-nav>
    </div>
    <div class="repos-desc__content" :style="{height: descHeight}">
      <DynamicScroller
        :items="repos"
        :min-item-size="54"
        class="scroller"
      >
        <template v-slot="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :size-dependencies="[
              item.description,
            ]"
            :data-index="index"
            class="content-card-item"
          >
            <v-hover>
              <v-card
                class="repos-desc__card"
                slot-scope="{ hover }"
                :color="hover ? 'light-blue lighten-5' : ''"
                @click.stop.native="showReadme(item)">
                <v-card-title>
                  <div class="title font-weight-bold text-truncate" v-text="item.owner_name+'/'+item.repo_name"></div>
                </v-card-title>
                <v-card-text class="font-weight-light" v-text="item.description"></v-card-text>
                <v-card-actions>
                  <v-chip
                    v-if="item.language != 'null'"
                    color="pink lighten-1"
                    text-color="white"
                    small
                    @click.stop="filterByLanguage(item.language)"
                  >
                    {{item.language}}
                  </v-chip>
                </v-card-actions>
                <v-card-actions>
                  <v-layout align-center>
                    <v-flex d-flex xs12 sm12 md6>
                      <v-layout justify-start>
                        <span class="v-icon mr-1" v-html="starIcon" />
                        <span class="star-count mr-2" v-text="item.stargazers_count">256</span>
                        <span class="mr-1">·</span>
                        <span class="v-icon mr-1" v-html="forkedIcon" />
                        <span class="fork-count" v-text="item.forks_count"></span>
                      </v-layout>
                    </v-flex>
                    <v-flex d-flex xs12 sm12 md6>
                      <v-layout align-center justify-end>
                        <v-btn flat small color="primary" @click.stop="openInBrowser(item.html_url)">
                          View on GitHub
                        </v-btn>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                  <!-- <v-layout align-center justify-end>
                    
                  </v-layout> -->
                </v-card-actions>
              </v-card>
            </v-hover>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </div>
  </div>
</template>

<script>
import { shell } from 'electron'
import { mapState, mapActions } from 'vuex'

import { getOcticon } from '../../utils/helpers'

export default {
  name: 'RepoDesc',

  data () {
    return {
      zDepth: 1,
      activeTab: 'tab1',
      scroller: null,
      activeTopNav: 'time',
      starIcon: getOcticon('star'),
      forkedIcon: getOcticon('repo-forked')
    }
  },

  computed: {
    ...mapState({
      isInfinite: state => state.global.isInfinite,
      langGroup: state => state.github.langGroup,
      // lazyRepos: state => state.github.lazyRepos,
      repos: state => state.github.repos,
      loadingRepos: state => state.content.loadingRepos,
      selectedRepo: state => state.content.selectedRepo,
      descHeight: state => {
        const { windowSize } = state.global
        return `${windowSize.y - windowSize.toolbarHeight - 92}px`
      }
    })
  },

  mounted () {
    this.scroller = this.$el
    // this.reloadRepos(false)
  },

  methods: {
    ...mapActions([
      'showReadme',
      'reloadRepos',
      'orderedRepos',
      'filterByLanguage'
    ]),
    // setLazyRepos (lazyRepos) {
    //   return this.$store.dispatch('setLazyRepos', { lazyRepos })
    // },
    orderedRepos (orderField) {
      return this.orderedRepos({ orderField })
    },
    filterByLanguage (lang) {
      return this.filterByLanguage({ lang })
    },
    openInBrowser (url) {
      shell.openExternal(url)
    }
  }
}
</script>

<style lang="less">
.repos-desc {
  &__content {
    .scroller {
      height: 100%;
      .vue-recycle-scroller__item-wrapper {
        margin: 4px 0;
      }
    }
    .content-card-item {
      padding: 4px 8px;
    }
    .repos-desc__card,
    .repos-desc__card .v-chip .v-chip__content {
      cursor: pointer;
    }
  }
}
</style>
