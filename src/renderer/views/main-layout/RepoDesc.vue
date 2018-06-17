<template>
  <div id="repos-desc" class="repos-desc animated fadeIn">
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
    <mu-load-more :loading="isInfinite" @load="reloadRepos(true)" loading-text="Loading... ...">
      <template v-for="repo in lazyRepos">
        <mu-paper :zDepth="selectedRepo == repo.repo_name ? 3 : 1" :key="repo._id">
          <div class="mu-card repos-desc-card" @click.stop="showReadme(repo)">
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
        </mu-paper>
      </template>
    </mu-load-more>
    <!-- <mu-infinite-scroll :scroller="scroller" :loading="isInfinite" @load="reloadRepos(true)" loadingText="Loading... ..."/> -->
  </div>
</template>

<script>
import $ from 'jquery'
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
      lazyRepos: state => state.github.lazyRepos,
      loadingRepos: state => state.content.loadingRepos,
      selectedRepo: state => state.content.selectedRepo
    })
  },

  watch: {
    langGroup (val) {
      if (val) {
        this.toggleLoadingRepos()
      }
    },
    loadingRepos (val) {
      if (val) {
        this.reloadRepos(false)
      }
    }
  },

  methods: {
    ...mapActions([
      'showReadme',
      'toggleLoadingRepos',
      'reloadRepos'
    ]),
    setLazyRepos (lazyRepos) {
      return this.$store.dispatch('setLazyRepos', { lazyRepos })
    },
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
    $(document).ready(function () {
      $('body').css('overflow', 'hidden')
      // $('[data-toggle="tooltip"]').tooltip()
      // $('.repos-desc').css('height', $(window).height() - 124)
    })
    // $(window).resize(function () {
    //   $('.repos-desc').css('height', $(this).height() - 124)
    // })
    this.reloadRepos(false)
  }
}
</script>

<style lang="less" scoped>
.mt8 {
  margin-top: 8px;
}
.repos-desc {
  position: absolute;
  background: #fafafa;
  border-right: 1px solid rgba(55,53,112,0.08);
  padding: 8px;
  top: 64px;
  bottom: 0;
  width: 480px;
  overflow-x: hidden;
  overflow-y: auto;
}
.mu-tabs {
  margin-bottom: 8px;
  .mu-tab {
    min-width: 112px;
  }
}
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
      color: #546e7a;
    }
  }
  .mu-card-text {
    padding: 8px 0;
    font-weight: 500;
    color: #546e7a;
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
    color: #546e7a;
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
    color: #26a69a;
    font-size: 13px;
    font-weight: bold;
    text-transform: inherit;
  }
  a:hover {
    color: #004D40;
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
