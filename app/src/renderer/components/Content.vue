<script>
  import Readme from './Readme'
  import MdlLoading from './mdl/MdlLoading'
  import MdlFab from './mdl/MdlFab'
  const { shell } = require('electron')
  import $ from 'jquery'
  import hljs from 'highlight.js'
  import MarkdownIt from 'markdown-it'
  import db from '../services/db'
  import request from 'superagent'
  import { mapState, mapActions } from 'vuex'
  // import marked, { Renderer } from 'marked'

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    langPrefix: 'lang-',
    highlight: (code, language) => {
      // Check whether the given language is valid for highlight.js.
      const validLang = !!(language && hljs.getLanguage(language))
      // Highlight only if the language is valid.
      const highlighted = validLang ? hljs.highlight(language, code).value : code
      // Render the highlighted code with `hljs` class.
      return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`
    }
  })

  // // Create your custom renderer.
  // const renderer = new Renderer();
  //
  // renderer.code = (code, language) => {
  //   // Check whether the given language is valid for highlight.js.
  //   const validLang = !!(language && hljs.getLanguage(language));
  //   // Highlight only if the language is valid.
  //   const highlighted = validLang ? hljs.highlight(language, code).value : code;
  //   // Render the highlighted code with `hljs` class.
  //   return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
  // };
  //
  // marked.setOptions({
  //   renderer,
  //   gfm: true,
  //   tables: true,
  //   breaks: false,
  //   pedantic: false,
  //   sanitize: true,
  //   smartLists: true,
  //   smartypants: false,
  //   highlight: function(code) {
  //     return hljs.highlightAuto(code).value;
  //   }
  // })

  export default {
    name: 'Content',

    data () {
      return {
        repoReadme: '',
        loading: false,
        scroller: null,
        activeTab: 'tab1',
        zDepth: 1,
        selectedRepo: ''
      }
    },

    computed: {
      ...mapState({
        github: state => state.github.github,
        reposCount: state => state.github.reposCount,
        langGroup: state => state.github.langGroup,
        lazyRepos: state => state.github.lazyRepos,
        searchQuery: state => state.github.searchQuery,
        loadingRepos: state => state.content.loadingRepos,
        loadingReadme: state => state.content.loadingReadme,
        activeRepo: state => state.content.activeRepo,
        repoKey: state => state.content.repoKey,
        order: state => state.content.order,
        filterFields: state => state.sidebar.filterFields,
        limitCount: state => state.global.limitCount
      })
    },

    mounted () {
      $(document).ready(function () {
        $('body').css('overflow', 'hidden')
        // $('[data-toggle="tooltip"]').tooltip()
        // $('.repos-desc').css('height', $(window).height() - 124)
      })
      this.scroller = this.$el
      // $(window).resize(function () {
      //   $('.repos-desc').css('height', $(this).height() - 124)
      // })
    },

    methods: {
      ...mapActions([
        'toggleLoadingRepos',
        'toggleLoadingReadme',
        'increaseLimit'
      ]),
      setActiveRepo (repo) {
        return this.$store.dispatch('setActiveRepo', { repo: repo })
      },
      orderRepo (repoKey) {
        return this.$store.dispatch('orderRepo', { repoKey: repoKey })
      },
      setLazyRepos (lazyRepos) {
        return this.$store.dispatch('setLazyRepos', { lazyRepos: lazyRepos })
      },
      filterByLanguage (searchQuery) {
        return this.$store.dispatch('filterByLanguage', { searchQuery: searchQuery })
      },
      orderedRepos (orderField) {
        return this.$store.dispatch('orderedRepos', {orderField: orderField})
      },
      openInBrowser (url) {
        shell.openExternal(url)
      },
      showReadme (repo) {
        const self = this
        if (repo._id !== this.activeRepo._id) {
          this.setActiveRepo(repo)
          this.toggleLoadingReadme()
          const githubRepo = this.github.getRepo(repo.owner_name, repo.repo_name)
          const readmeUrl = 'https://api.github.com/repos/' + repo.owner_name + '/' + repo.repo_name + '/readme'
          request.get(readmeUrl)
            .accept('application/json')
            .end(function (err, res) {
              if (!err && res) {
                githubRepo.getContents('master', res.body.name, true, function (err, data) {
                  if (err) {
                    console.dir(err.status)
                    // TODO dealwith 404
                  }
                  // self.repoReadme = marked(data)
                  self.repoReadme = md.render(data)
                  self.toggleLoadingReadme()
                })
              } else {
                console.log('Something went wrong fetching from GitHub', err)
              }
            })
        }
        this.selectedRepo = repo.repo_name
      },
      loadMore () {
        const self = this
        // Configurable
        console.log('into loadMore func')
        // this.increaseLimit()
        // setTimeout(() => {
        //   db.fetchLazyRepos(self.limitCount).then(lazyRepos => {
        //     self.setLazyRepos(lazyRepos)
        //     // self.$broadcast('$InfiniteLoading:loaded')
        //     self.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
        //   })
        // }, 1000)
        this.loading = true
        setTimeout(() => {
          db.fetchLazyRepos(self.limitCount).then(lazyRepos => {
            self.setLazyRepos(lazyRepos)
          })
          self.loading = false
        }, 2000)
      },
      reload () {
        const self = this
        setTimeout(() => {
          db.fetchLazyRepos(self.limitCount).then(lazyRepos => {
            self.setLazyRepos(lazyRepos)
          })
        }, 1000)
      },
      handleTabChange (val) {
        this.activeTab = val
      }
    },

    watch: {
      langGroup (val) {
        this.toggleLoadingRepos()
      },
      loadingRepos (val) {
        if (val) {
          this.reload()
        }
      }
    },

    components: {
      Readme,
      MdlLoading,
      MdlFab
    }
  }
</script>

<template>
  <div class="content">
    <aside id= "repos-desc" class="repos-desc animated fadeIn">
      <mu-tabs :value="activeTab" @change="handleTabChange">
        <mu-tab value="tab1" icon="schedule" title="Time" @click="orderedRepos('repo_idx')"/>
        <mu-tab value="tab2" icon="person" title="Owner" @click="orderedRepos('owner_name')"/>
        <mu-tab value="tab3" icon="archive" title="Repo" @click="orderedRepos('repo_name')"/>
        <mu-tab value="tab4" icon="star" title="Star" @click="orderedRepos('stargazers_count')"/>
      </mu-tabs>
      <template v-for="repo in lazyRepos">
        <mu-paper class="demo-paper" :zDepth="selectedRepo == repo.repo_name ? 3 : 1">
          <div class="mu-card" @click="showReadme(repo)">
            <div class="mu-card-title-container">
              <div class="mu-card-title" v-text="repo.owner_name+'/'+repo.repo_name"></div>
            </div>
            <div class="mu-card-text" v-text="repo.description"></div>
            <div class="mu-card-actions">
              <div class="mu-chip demo-chip" v-text="repo.language" v-if="repo.language != 'null'" @click="filterByLanguage(repo.language)"></div>
            </div>
            <div class="mu-card-actions card-action">
              <div class="repo-count">
                <div class="star"><i class="material-icons">star</i> <span v-text="repo.stargazers_count"></span></div>
                <div class="fork"><i class="material-icons">star</i> <span v-text="repo.forks_count"></span></div>
              </div>
              <a href="#" @click="openInBrowser(repo.html_url)">View on GitHub</a>
            </div>
          </div>
        </mu-papaer>
      </template>
      <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
    </aside>
    <mdl-fab></mdl-fab>
    <mdl-loading v-show='loadingReadme'></mdl-loading>
    <aside id="repos-readme" class="repos-readme">
      <div class='empty-placeholder' v-if='repoReadme.length == 0'>
        No Repo Selected
      </div>
      <readme :repo-readme='repoReadme' v-else></readme>
    </aside>
  </div>
</template>

<style lang="less" scoped>
.mt8 {
  margin-top: 8px;
}
.flex-demo {
  height: 32px;
  background-color: #e0e0e0;
  text-align: center;
  line-height: 32px;
}
.repos-desc {
  position: absolute;
  background: #fafafa;
  border-right: 1px solid rgba(55,53,112,0.08);
  padding: 8px;
  top: 64px;
  bottom: 0;
  width: 320px;
  overflow-x: hidden;
  overflow-y: auto;
}
.repos-readme {
  position: absolute;
  background: #fff;
  color: #546e7a;
  top: 64px;
  right: 0;
  bottom: 0;
  min-width: 448px;
  overflow-x: hidden;
  overflow-y: scroll;
  .empty-placeholder {
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    color: #658399;
    font-weight: bold;
    pointer-events: none;
    position: absolute;
    top: 50%;
    left: 0;
    text-align: center;
    width: 100%;
  }
}
.mu-tabs {
  margin-bottom: 8px;
}
.mu-card {
  margin-bottom: 8px;
  cursor: pointer;
  .mu-card-title-container {
    padding: 8px 16px;
    .mu-card-title {
      font-size: 18px;
      font-weight: 700;
      color: #546e7a;
    }
  }
  .mu-card-text {
    padding: 0 16px;
    font-weight: 500;
    color: #546e7a;
  }
  .mu-card-actions {
    .mu-chip {
      cursor: pointer;
      font-size: 12px;
      color: #546e7a;
      background-color: rgb(238, 238, 238);
    }
    .mu-chip:hover {
      color: #004D40;
      text-decoration: underline;
    }
  }
}
.card-action {
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
      padding: 5px 0;
    }
    .fork {
      padding: 5px 0;
    }
    span {
      float: right;
    }
  }
  a {
    float: right;
    margin: 0px;
    padding: 8px 0;
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
</style>
