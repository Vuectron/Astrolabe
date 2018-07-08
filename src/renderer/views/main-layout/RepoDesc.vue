<template>
  <div id="repos-desc" class="repos-desc animated fadeIn">
    <div class="repos-desc__header">
      <mu-tabs :value="activeTab" center @change="handleTabChange">
        <mu-tab value="tab1" @click="orderedRepos('repo_idx')">
          <mu-icon value="schedule" />
          Time
        </mu-tab>
        <mu-tab value="tab2" @click="orderedRepos('owner_name')">
          <mu-icon value="person" />
          Owner
        </mu-tab>
        <mu-tab value="tab3" @click="orderedRepos('repo_name')">
          <mu-icon value="archive" />
          Repo
        </mu-tab>
        <mu-tab value="tab4" @click="orderedRepos('stargazers_count')">
          <mu-icon value="star" />
          Star
        </mu-tab>
      </mu-tabs>
    </div>
    <div class="repos-desc__content">
      <!-- <mu-load-more :loading="isInfinite" @load="reloadRepos(true)" loading-text="Loading... ..."> -->
        <div
          v-for="repo in repos"
          class="mu-card repos-desc-card"
          :class="{'mu-card__raised': selectedRepo === repo.repo_name}"
          :key="repo._id"
          @click.stop="showReadme(repo)">
          <div class="mu-card-title-container">
            <div class="mu-card-title" v-text="repo.owner_name+'/'+repo.repo_name"></div>
          </div>
          <div class="mu-card-text" v-text="repo.description"></div>
          <div class="mu-card-actions tag-action">
            <mu-badge
              v-if="repo.language != 'null'" 
              :content="repo.language"
              @click.stop="filterByLanguage(repo.language)"
            />
          </div>
          <div class="mu-card-actions card-action">
            <div class="repo-count">
              <div class="star"><i class="material-icons">star</i> <span v-text="repo.stargazers_count"></span></div>
              <div class="fork"><i class="material-icons">star</i> <span v-text="repo.forks_count"></span></div>
            </div>
            <a href="#" @click.stop="openInBrowser(repo.html_url)">View on GitHub</a>
          </div>
        </div>
      <!-- </mu-load-more> -->
    </div>
    <!-- <mu-infinite-scroll :scroller="scroller" :loading="isInfinite" @load="reloadRepos(true)" loadingText="Loading... ..."/> -->
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
      scroller: null
    }
  },

  computed: {
    ...mapState({
      isInfinite: state => state.global.isInfinite,
      langGroup: state => state.github.langGroup,
      // lazyRepos: state => state.github.lazyRepos,
      repos: state => state.github.repos,
      loadingRepos: state => state.content.loadingRepos,
      selectedRepo: state => state.content.selectedRepo
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
    handleTabChange (val) {
      this.activeTab = val
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
@import '../../assets/variables.less';

.repos-desc {
  position: absolute;
  border-right: 1px solid rgba(55, 53, 112, 0.08);
  padding: 8px;
  top: 64px;
  bottom: 0;
  width: 480px;
  overflow-x: hidden;
  overflow-y: auto;
  .repos-desc__header {
    display: flex;
  }
  // tabs style
  .mu-tabs {
    margin-bottom: 8px;
    .mu-tab {
      min-width: 112px;
    }
  }
  .repos-desc__content {
    position: absolute;
    top: 88px;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0 8px;
    overflow-y: auto;
  }
  .mu-load-more {
    overflow: visible;
  }
}

// card style
.mu-card {
  margin-bottom: 8px;
  cursor: pointer;
  &.repos-desc-card {
    padding: 8px 16px;
  }
  .mu-card-title-container {
    padding: 0;
    .mu-card-title {
      font-size: 18px;
      font-weight: 700;
      color: @card-font--color;
    }
  }
  .mu-card-text {
    padding: 8px 0;
    font-weight: 500;
    color: @card-font--color;
  }
  .tag-action {
    padding: 8px 0;
  }
}
.card-action {
  padding: 8px 0 0 0;
  border-top: 1px solid #eee;
  .repo-count {
    display: inline-flex;
    padding-top: 2px;
    font-weight: bold;
    color: @card-font--color;
    i{
      font-size: 18px;
    }
    .star {
      margin-right: 4px;
      padding: 4px 0;
    }
    .fork {
      padding: 4px 0;
    }
    span {
      float: right;
    }
  }
  a {
    float: right;
    margin: 0px;
    padding: 4px 0;
    transition: color .3s ease;
    color: @secondary--color;
    font-size: 13px;
    font-weight: bold;
    text-transform: inherit;
  }
  a:hover {
    color: @secondary--color;
    opacity: .8;
    text-decoration: underline;
  }
}
.card-content.white-text {
  color: #ffffff;
  a {
    color: #ffab40;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
</style>
