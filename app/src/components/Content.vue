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
  import InfiniteLoading from 'vue-infinite-loading'
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
        distance: 100
      }
    },

    computed: {
      github () {
        return this.$store.state.github.github
      },
      reposCount () {
        return this.$store.state.github.reposCount
      },
      langGroup () {
        return this.$store.state.github.langGroup
      },
      lazyRepos () {
        return this.$store.state.github.lazyRepos
      },
      loadingRepos () {
        return this.$store.state.content.loadingRepos
      },
      loadingReadme () {
        return this.$store.state.content.loadingReadme
      },
      activeRepo () {
        return this.$store.state.content.activeRepo
      },
      repoKey () {
        return this.$store.state.content.repoKey
      },
      order () {
        return this.$store.state.content.order
      },
      searchQuery () {
        return this.$store.state.sidebar.searchQuery
      },
      filterFields () {
        return this.$store.state.sidebar.filterFields
      },
      limitCount () {
        return this.$store.state.global.limitCount
      }
    },

    mounted () {
      // $(document).ready(function () {
      //   $('body').css('overflow', 'hidden')
      //   // $('[data-toggle="tooltip"]').tooltip()
      //   $('.repos-desc').css('height', $(window).height() - 124)
      // })
      //
      // $(window).resize(function () {
      //   $('.repos-desc').css('height', $(this).height() - 124)
      // })
    },

    methods: {
      toggleLoadingRepos () {
        return this.$store.dispatch('toggleLoadingRepos')
      },
      toggleLoadingReadme () {
        return this.$store.dispatch('toggleLoadingReadme')
      },
      setActiveRepo (repo) {
        return this.$store.dispatch('setActiveRepo', { repo: repo })
      },
      orderRepo (repoKey) {
        return this.$store.dispatch('orderRepo', { repoKey: repoKey })
      },
      setLazyRepos (lazyRepos) {
        return this.$store.dispatch('setLazyRepos', { lazyRepos: lazyRepos })
      },
      increaseLimit () {
        return this.$store.dispatch('increaseLimit')
      },
      filterByLanguage (searchQuery) {
        return this.$store.dispatch('filterByLanguage', { searchQuery: searchQuery })
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
      },
      loadMore () {
        const self = this
        // Configurable
        this.increaseLimit()
        setTimeout(() => {
          db.fetchLazyRepos(self.limitCount).then(lazyRepos => {
            self.setLazyRepos(lazyRepos)
            self.$broadcast('$InfiniteLoading:loaded')
          })
        }, 1000)
      },
      reload () {
        const self = this
        setTimeout(() => {
          db.fetchLazyRepos(self.limitCount).then(lazyRepos => {
            self.setLazyRepos(lazyRepos)
          })
        }, 1000)
      }
    },

    watch: {
      'langGroup': function (val, oldVal) {
        this.toggleLoadingRepos()
      },
      'loadingRepos': function (val, oldVal) {
        if (!val) {
          this.reload()
        }
      }
    },

    components: {
      Readme,
      MdlLoading,
      MdlFab,
      InfiniteLoading
    }
  }
</script>

<template>
  <div class="content">
    <aside id= "repos-desc" class="repos-desc">
      <mu-card v-for="repo in lazyRepos" @click="showReadme(repo)">
        <mu-card-title :title="repo.owner_name+'/'+repo.repo_name"/>
        <mu-card-text v-text="repo.description"></mu-card-text>
        <mu-card-actions>
          <mu-chip class="demo-chip" backgroundColor="cyan300" v-text="repo.language" v-if="repo.language != 'null'"></mu-chip>
          <mu-flat-button @click="openInBrowser(repo.html_url)" label="View on GitHub" secondary></mu-flat-button>
        </mu-card-actions>
      </mu-card>
      <infinite-loading :distance="distance" :on-infinite="loadMore" v-if="limitCount < reposCount">No More Data.</infinite-loading>
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
.mu-card {
  margin-bottom: 8px;
}
.repos-desc {
  position: absolute;
  background: #fafafa;
  border-right: 1px solid rgba(55,53,112,0.08);
  padding: 8px;
  top: 64px;
  bottom: 0;
  overflow-y: auto;
  width: 320px;
}
.repos-readme {
  position: absolute;
  background: #fff;
  color: #546e7a;
  top: 64px;
  left: 576px;
  right: 0;
  bottom: 0;
  min-width: 448px;
  transition: all .45s cubic-bezier(0.23, 1, 0.32, 1);
  overflow-y: scroll;
  overflow-x: hidden;
}
.repos-readme .empty-placeholder {
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
.mu-card-title-container .mu-card-title {
  font-size: 18px !important;
}
.mu-card-text {
  padding: 8px 16px;
}
.mu-card-actions {
  .mu-flat-button {
    float: right;
  }
}
.mu-flat-button-wrapper {
  .mu-flat-button-label {
    font-size: 12px;
  }
}
</style>
