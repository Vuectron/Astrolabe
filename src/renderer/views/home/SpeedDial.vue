<template>
  <v-speed-dial
    v-model="fab"
    bottom
    right
    open-on-hover
    transition="slide-y-reverse-transition"
    style="position: absolute;"
  >
    <template v-slot:activator>
      <v-btn v-model="fab" color="blue darken-2" dark fab>
        <v-icon>create</v-icon>
        <v-icon>add</v-icon>
      </v-btn>
    </template>
    <v-btn fab dark small color="pink" @click="backToTop">
      <v-icon>expand_less</v-icon>
    </v-btn>
    <v-btn fab dark small color="green" @click="openInBrowser(activeRepo.downloads_url)">
      <v-icon>file_download</v-icon>
    </v-btn>
    <v-btn fab dark small color="indigo" @click="copyToClipboard(activeRepo.clone_url)">
      <v-icon>content_copy</v-icon>
    </v-btn>
    <v-btn fab dark small color="red" @click="openInBrowser(activeRepo.html_url)">
      <v-icon>open_in_browser</v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script>
import { shell, clipboard } from 'electron'

export default {
  name: 'SpeedDial',
  data: () => ({
    fab: false,
    transition: 'slide-y-reverse-transition',
    copyTooltip: 'Copy clone link to clipboard'
  }),
  computed: {
    activeRepo () {
      return this.$store.state.content.activeRepo
    }
  },
  methods: {
    openInBrowser (url) {
      shell.openExternal(url)
    },
    copyToClipboard (url) {
      clipboard.writeText(url)
      shell.beep()
      this.copyTooltip = 'Copied'
      this.$emit('toast', url)
    },
    backToTop () {
      const element = document.querySelector('.article-wrap')
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>

