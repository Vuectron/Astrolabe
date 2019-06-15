<template>
  <section id="repos-readme" class="repos-readme" :style="{height: rightPaneHeight}">
    <div class="empty-placeholder" v-if="repoReadme.length == 0">
      No Repo Selected
    </div>
    <div class="progress-wrap" v-if="isLoadingReadme">
      <v-progress-circular
        indeterminate
        color="primary"
        :size="50"
      ></v-progress-circular>
    </div>
    <div class="readme animated fadeIn" v-html="repoReadme" ref="repoReadme" v-else></div>
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
import { mapState } from 'vuex'
import SpeedDial from './SpeedDial'

import { shell } from 'electron'

export default {
  name: 'RepoReadme',
  components: {
    SpeedDial
  },
  data: () => ({
    snackbar: false,
    snackbarTip: 'Repo clone link copied'
  }),
  computed: {
    ...mapState({
      repoReadme: state => state.content.repoReadme,
      isLoadingReadme: state => state.content.loadingReadme,
      rightPaneHeight: state => `${state.global.windowSize.y - 100}px`
    })
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
    openInBrowser (url) {
      shell.openExternal(url)
    }
  }
}
</script>

<style lang="less">
pre {
  position: relative;
  margin-bottom: 24px;
  border-radius: 3px;
  overflow: hidden;
}

code {
  background-color: #FCE4EC;
  color: #880E4F;
  padding: 0.1em 0.2em;
  font-family: Menlo, Monaco, Consolas, Courier, monospace;
}

.repos-readme .empty-placeholder,
.repos-readme .progress-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 2em;
}

.repos-readme .readme {
  font-size: 16px;
  line-height: 1.6;
  word-wrap: break-word;
  padding: 16px;
}

.repos-readme .readme a {
  color: #00bfa5;
}

.repos-readme .readme a:hover {
  color: #009688;
  text-decoration: underline;
}

.repos-readme .readme img {
  max-width: 100%;
  height: auto;
  vertical-align: middle;
}

.repos-readme .readme h1 {
  padding-bottom: 0.3em;
  font-size: 2.25em;
  line-height: 1.2;
  border-bottom: 1px solid #eee;
}

.repos-readme .readme h2 {
  padding-bottom: 0.3em;
  font-size: 1.75em;
  font-weight: bold;
  line-height: 1.225;
  border-bottom: 1px solid #eee;
}

.repos-readme .readme h3 {
  font-size: 1.5em;
  font-weight: bold;
  line-height: 1.43;
}

.repos-readme .readme ul {
  padding-left: 2em;
  list-style-type: disc;
}

.repos-readme .readme ul li {
  list-style-type: disc;
}

.repos-readme .readme ul ul,
.repos-readme .readme ol ul {
  list-style-type: circle;
}
</style>
