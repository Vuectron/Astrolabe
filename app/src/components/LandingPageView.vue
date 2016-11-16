<script>
  import Links from './LandingPageView/Links'
  import Versions from './LandingPageView/Versions'
  import MuAppbar from 'muse-ui/appbar'
  import MuTextField from 'muse-ui/textField'
  import MuFlatButton from 'muse-ui/flatButton'

  export default {
    components: {
      Links,
      Versions,
      MuAppbar,
      MuTextField,
      MuFlatButton
    },
    name: 'landing-page'
  }
</script>

<template>
  <div>
    <mu-appbar title="Astrolabe">
      <mu-text-field icon="search" class="appbar-search-field" slot="right" hintText="search..."></mu-text-field>
      <mu-flat-button color="white" label="flat Button" slot="right"></mu-flat-button>
    </mu-appbar>
  </div>
</template>

<style lang="less" scoped>
.appbar-search-field{
  color: #FFF;
  margin-bottom: 0;
  &.focus-state {
    color: #FFF;
  }
  .mu-text-field-hint {
    color: fade(#FFF, 54%);
  }
  .mu-text-field-input {
    color: #FFF;
  }
  .mu-text-field-focus-line {
    background-color: #FFF;
  }
}
</style>
