<script>
  import $ from 'jquery'
  const { shell } = require('electron')

  export default {
    name: 'Readme',

    props: [
      'repoReadme'
    ],

    mounted () {
      const self = this

      $(document).ready(function () {
        // dealwith table style
        $('table').addClass('bordered striped')
      })

      // prevent default click action instead of execute openInBrowser()
      $('.readme a').click(function (e) {
        e.preventDefault()
        const href = $(this).attr('href')
        if (href.match(/^[a-zA-Z]+:\/\//)) {
          self.openInBrowser(href)
        } else {
          // TODO dealwith wrong url
          console.log('[' + href + '] is a wrong url')
        }
      })
    },

    methods: {
      openInBrowser (url) {
        shell.openExternal(url)
      }
    }
  }
</script>
<template>
  <div class="readme animated fadeIn">
    <div class="" v-html="repoReadme"/>
  </div>
</template>
<style>
  code,
  kbd,
  pre,
  samp {
    font: 0.9em Consolas, Monaco, Menlo, Courier, monospace
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

  .repos-readme .readme {
    font-family: "Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 16px;
    line-height: 1.6;
    word-wrap: break-word;
    margin: 16px;
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
    font-family: Consolas, Monaco, Menlo, Courier, monospace;
  }
</style>
