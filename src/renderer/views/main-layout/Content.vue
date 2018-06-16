<template>
  <div class="content">
    <repo-desc></repo-desc>
    <mdl-fab></mdl-fab>
    <mdl-loading v-show='loadingReadme'></mdl-loading>
    <aside id="repos-readme" class="repos-readme">
      <div class='empty-placeholder' v-if='repoReadme.length == 0'>
        No Repo Selected
      </div>
      <readme :repo-readme='repoReadme'></readme>
    </aside>
  </div>
</template>

<script>
  import RepoDesc from './RepoDesc'
  import Readme from './Readme'
  import MdlLoading from './mdl/MdlLoading'
  import MdlFab from './mdl/MdlFab'
  import { mapState } from 'vuex'

  export default {
    name: 'Content',

    computed: {
      ...mapState({
        loadingReadme: state => state.content.loadingReadme,
        repoReadme: state => state.content.repoReadme
      })
    },

    components: {
      RepoDesc,
      Readme,
      MdlLoading,
      MdlFab
    }
  }
</script>

<style lang="less" scoped>
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
</style>
