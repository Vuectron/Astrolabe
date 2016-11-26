<script>
  const { shell } = require('electron')
  import $ from 'jquery'
  // import Clipboard from 'clipboard'
  //
  // const clipboard = new Clipboard('.btn')
  //
  // clipboard.on('success', function (e) {
  //   console.info('Action:', e.action)
  //   console.info('Text:', e.text)
  //   console.info('Trigger:', e.trigger)
  //
  //   e.clearSelection()
  // })

  export default {
    name: 'MdlFab',

    data () {
      return {
        copyTooltip: 'Copy clone link to clipboard',
        showCopy: false,
        operateIcon: 'add'
      }
    },

    computed: {
      activeRepo () {
        return this.$store.state.content.activeRepo
      }
    },

    methods: {
      openInBrowser (url) {
        shell.openExternal(url)
      },
      backToTop (name, speed) {
        if (!speed) speed = 300
        if (!name) {
          $('#repos-readme').animate({
            scrollTop: 0
          }, speed)
        } else {
          if ($(name).length > 0) {
            $('#repos-readme').animate({
              scrollTop: $(name).offset().top
            }, speed)
          }
        }
      }
    },

    watch: {
      activeRepo (val) {
        if (typeof (val) !== undefined) {
          this.showCopy = true
        }
      }
    }
  }
</script>

<template>
  <div class="fab">
    <a href="#" class="btn-fab btn-floating" tooltip="View on GitHub" v-show="showCopy" @click="openInBrowser(activeRepo.html_url)">
      <i class="material-icons">open_in_browser</i>
    </a>
    <a href="#" class="btn btn-fab btn-floating"
      :data-clipboard-text="activeRepo.clone_url"
      :tooltip="copyTooltip"
      v-show="showCopy"
      @click="copyTooltip = 'Copied'">
      <i class="material-icons">content_copy</i>
    </a>
    <a href="#" class="btn-fab btn-floating" tooltip="Download" v-show="showCopy" @click="openInBrowser(activeRepo.downloads_url)">
      <i class="material-icons">file_download</i>
    </a>
    <a href="#" class="btn-fab btn-floating" tooltip="Back to Top" @click="backToTop()">
      <i class="material-icons">expand_less</i>
    </a>
    <a href="#" class="btn-fab btn-large btn-floating" tooltip="OPERATE" @mouseenter="copyTooltip = 'Copy clone link to clipboard'">
      <i class="large material-icons rotate" v-text="operateIcon" @mouseenter="operateIcon = 'create'" @mouseleave="operateIcon = 'add'"></i>
    </a>
  </div>
</template>

<style scope>
  .fab {
    margin: 1em;
    position: fixed;
    bottom: 0;
    right: 20px;
    z-index: 1099;
  }

  .fab:hover .btn-fab:not(:last-of-type) {
    width: 40px;
    height: 40px;
    margin: 15px auto 0;
    opacity: 1;
  }

  .btn-fab {
    display: block;
    text-align: center;
    line-height: 55px;
    width: 35px;
    height: 35px;
    margin: 20px auto 0;
    text-decoration: none;
    position: relative;
    border-radius: 50%;
    overflow: inherit;
    box-shadow: 0px 5px 11px -2px rgba(0, 0, 0, 0.18), 0px 4px 12px -7px rgba(0, 0, 0, 0.15);
    opacity: 0;
    transition: .2s;
  }

  .btn-fab:nth-last-of-type(2) {
    background-color: #03a9f4;
    color: #ffffff;
    transition-delay: 20ms;
  }

  .btn-fab:nth-last-of-type(3) {
    background-color: #4caf50;
    color: #ffffff;
    transition-delay: 40ms;
  }

  .btn-fab:nth-last-of-type(4) {
    background-color: #ffeb3b;
    color: #ffffff;
    transition-delay: 60ms;
  }

  .btn-fab:nth-last-of-type(5) {
    background-color: #ff4081;
    color: #ffffff;
    transition-delay: 80ms;
  }

  .btn-fab:nth-last-of-type(6) {
    background-color: #f44336;
    color: #ffffff;
    transition-delay: 100ms;
  }

  .btn-fab:nth-last-of-type(1) {
    background-color: #f44336;
    color: #ffffff;
    width: 56px;
    height: 56px;
    opacity: 1;
  }

  .btn-fab:hover {
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);
  }

  .fab i {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .fab i.rotate {
    transform: rotate(90deg);
    transition: .3s;
    text-align: center;
    line-height: 55px;
  }

  .fab i.rotate:hover {
    transform: rotate(0deg);
    transition: .3s;
  }

  [tooltip]:before {
    content: attr(tooltip);
    background: #585858;
    padding: 5px 7px;
    margin-right: 10px;
    border-radius: 2px;
    color: #FFF;
    font: 500 12px Roboto;
    white-space: nowrap;
    position: absolute;
    bottom: 20%;
    right: 100%;
    visibility: hidden;
    opacity: 0;
    transition: .3s;
  }

  [tooltip]:hover:before {
    visibility: visible;
    opacity: 1;
  }
</style>
