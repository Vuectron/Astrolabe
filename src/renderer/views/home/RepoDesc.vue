<template>
  <div id="repos-desc" class="repos-desc animated fadeIn">
    <div class="repos-desc__header">
      <!-- Use bottom-nav as top-nav -->
      <v-bottom-nav
        :active.sync="activeTopNav"
        :value="true"
        class="as-top-nav"
        color="transparent"
      >
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
      <v-hover v-for="repo in repos" :key="repo._id">
        <v-card
          class="repos-desc__card"
          slot-scope="{ hover }"
          :color="hover ? 'light-blue lighten-5' : ''"
          @click.stop.native="showReadme(repo)">
          <v-card-title>
            <div class="title font-weight-bold" v-text="repo.owner_name+'/'+repo.repo_name"></div>
          </v-card-title>
          <v-card-text class="font-weight-light" v-text="repo.description"></v-card-text>
          <v-card-actions>
            <v-chip
              v-if="repo.language != 'null'"
              color="pink"
              text-color="white"
              @click.stop="filterByLanguage(repo.language)"
            >
              {{repo.language}}
            </v-chip>
          </v-card-actions>
          <v-card-actions>
            <v-layout align-center>
              <v-icon class="mr-1">star</v-icon>
              <span class="star-count mr-2" v-text="repo.stargazers_count">256</span>
              <span class="mr-1">·</span>
              <v-icon class="mr-1">star</v-icon>
              <span class="fork-count" v-text="repo.forks_count"></span>
            </v-layout>
            <v-layout align-center justify-end>
              <v-btn flat small color="primary" @click.stop="openInBrowser(repo.html_url)">View on GitHub</v-btn>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-hover>
    </div>
  </div>
</template>

<script>
import { shell } from 'electron'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'RepoDesc',

  data () {
    return {
      zDepth: 1,
      activeTab: 'tab1',
      scroller: null,
      activeTopNav: 'time'
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
      descHeight: state => `${state.global.windowSize.y - 156}px`
    })
  },

  methods: {
    ...mapActions([
      'showReadme',
      'reloadRepos'
    ]),
    // setLazyRepos (lazyRepos) {
    //   return this.$store.dispatch('setLazyRepos', { lazyRepos })
    // },
    orderedRepos (orderField) {
      return this.$store.dispatch('orderedRepos', { orderField })
    },
    filterByLanguage (lang) {
      return this.$store.dispatch('filterByLanguage', { lang })
    },
    openInBrowser (url) {
      shell.openExternal(url)
    }
  },

  mounted () {
    this.scroller = this.$el
    // this.reloadRepos(false)
  }
}
</script>

<style lang="less" scoped>
.repos-desc {
  &__content {
    overflow-y: scroll;
    .repos-desc__card {
      margin: 8px 12px;
      padding: 4px 8px;
    }
  }
}
</style>
