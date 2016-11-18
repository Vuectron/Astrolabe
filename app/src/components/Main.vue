<script>
  export default {
    name: 'Main',
    data () {
      return {
        repoReadme: ''
      }
    }
  }
</script>

<template>
  <div class="content">
    <aside id= "repos-desc" class="repos-desc">
      <mu-card>
        <mu-card-title title="Angular/Material2"/>
        <mu-card-text>
          Material Design for Angular 2
        </mu-card-text>
        <mu-card-actions>
          <mu-flat-button label="Action 1"/>
          <mu-flat-button label="View on GitHub"/>
        </mu-card-actions>
      </mu-card>
      <mu-card>
        <mu-card-title title="Angular/Angular"/>
        <mu-card-text>
          Material Design for Angular 2
        </mu-card-text>
        <mu-card-actions>
          <mu-flat-button label="Action 1"/>
          <mu-flat-button label="View on GitHub"/>
        </mu-card-actions>
      </mu-card>
      <mu-card>
        <mu-card-title title="Angular/Angular"/>
        <mu-card-text>
          Material Design for Angular 2
        </mu-card-text>
        <mu-card-actions>
          <mu-flat-button label="Action 1"/>
          <mu-flat-button label="View on GitHub"/>
        </mu-card-actions>
      </mu-card>
      <mu-card>
        <mu-card-title title="Angular/Angular"/>
        <mu-card-text>
          Material Design for Angular 2
        </mu-card-text>
        <mu-card-actions>
          <mu-flat-button label="Action 1"/>
          <mu-flat-button label="View on GitHub"/>
        </mu-card-actions>
      </mu-card>
      <mu-card>
        <mu-card-title title="Angular/Angular"/>
        <mu-card-text>
          Material Design for Angular 2
        </mu-card-text>
        <mu-card-actions>
          <mu-flat-button label="Action 1"/>
          <mu-flat-button label="View on GitHub"/>
        </mu-card-actions>
      </mu-card>
    </aside>
    <main id="repos-readme" class="repos-readme">
      <div class='empty-placeholder' v-if='repoReadme.length == 0'>
        No Repo Selected
      </div>
    </main>
  </div>
</template>

<style lang="css" scoped>
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
  position: relative;
  background: #fafafa;
  border-right: 1px solid rgba(55,53,112,0.08);
  padding: 4px 8px;
  /*top: 64px;*/
  bottom: 0;
  left: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  /*overflow-y: auto;*/
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
</style>
