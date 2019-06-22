<template>
  <v-list dense class="sidebar-list">
    <template v-for="(item, index) in topList">
      <v-layout
        v-if="item.heading"
        :key="item.heading"
        row
        align-center>
        <v-flex xs6 md6>
          <v-subheader v-if="item.heading" class="text-uppercase">
            {{ item.heading }}
          </v-subheader>
        </v-flex>
        <v-flex xs6 md6 class="text-xs-right">
          <v-btn flat icon color="blue darken-1">
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-list-tile
        v-else
        :class="{'is-active': item.lang === activeLang}"
        :key="item.text"
        @click="handleChooseStar(index)">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>
            {{ item.text }}
          </v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action>
          <v-chip color="pink lighten-1" text-color="white" class="x-small">
            {{ item.count }}
          </v-chip>
        </v-list-tile-action>
      </v-list-tile>
    </template>

    <v-divider></v-divider>

    <template v-for="item in langGroupList">
      <v-layout
        v-if="item.heading"
        :key="item.heading"
        row
        align-center>
        <v-flex xs6 md6>
          <v-subheader v-if="item.heading" class="text-uppercase">
            {{ item.heading }}
          </v-subheader>
        </v-flex>
        <v-flex xs6 md6 class="text-xs-right">
          <v-btn flat icon color="blue darken-1">
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-list-group
        v-else-if="item.children"
        v-model="item.model"
        :key="item.text"
        :prepend-icon="item.icon"
      >
        <v-list-tile slot="activator">
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile
          v-for="(child, i) in item.children"
          :key="i"
          :class="{'is-active': child.lang === activeLang}"
          @click="handleChooseLang(child.lang)"
        >

          <v-list-tile-action>
            <i class="v-icon devicon" :class="[child.icon, {'colored': child.lang === activeLang}]"></i>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>
              {{ child.lang }}
            </v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action v-if="child.count">
            <v-chip color="pink lighten-1" text-color="white" class="x-small">
              {{ child.count }}
            </v-chip>
          </v-list-tile-action>
        </v-list-tile>
      </v-list-group>
    </template>

    <v-divider></v-divider>
    
    <template v-for="item in tagList">
      <v-layout
        v-if="item.heading"
        :key="item.heading"
        row
        align-center>
        <v-flex xs6 md6>
          <v-subheader v-if="item.heading" class="text-uppercase">
            {{ item.heading }}
          </v-subheader>
        </v-flex>
        <v-flex xs6 md6 class="text-xs-right">
          <v-btn flat icon color="blue darken-1">
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-list-group
        v-else-if="item.children"
        v-model="item.model"
        :key="item.text"
        :prepend-icon="item.icon"
        no-action
      >
        <v-list-tile slot="activator">
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile
          v-for="(child, i) in item.children"
          :key="i"
          @click="handleChooseTag"
        >
          <v-list-tile-content>
            <v-list-tile-title>
              {{ child.text }}
            </v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-icon>{{ child.icon }}</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list-group>
    </template>
  </v-list>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data: () => ({
    langList: { icon: 'sort', heading: 'Languages' },
    tagList: [
      { icon: 'add', heading: 'Tags' },
      {
        icon: 'label',
        text: 'All Tags',
        model: false,
        children: [
          { text: 'node' }
        ]
      }
    ]
  }),
  computed: {
    ...mapState({
      reposCount: state => state.github.reposCount,
      untaggedCount: state => state.github.untaggedCount,
      langGroup: state => state.github.langGroup.filter(v => v.lang !== 'null'),
      activeLang: state => state.github.activeLang
    }),
    topList () {
      return [
        { icon: 'cached', heading: 'Stars' },
        { icon: 'star', text: 'All Stars', count: this.reposCount, lang: null },
        { icon: 'bookmark_border', text: 'Untagged Stars', count: this.untaggedCount, lang: 'null' }
      ]
    },
    langGroupList () {
      const allLang = {
        icon: 'code',
        text: 'All Languages',
        model: true,
        children: this.langGroup
      }
      return [this.langList, allLang]
    }
  },
  methods: {
    ...mapActions([
      'filterByLanguage'
    ]),
    handleChooseStar (index) {
      const params = {
        lang: index === 1 ? null : 'null'
      }
      this.filterByLanguage(params)
    },
    handleChooseLang (lang) {
      this.filterByLanguage({ lang })
    },
    handleChooseTag () {
      console.log('tag')
    }
  }
}
</script>

<style lang="less">
.sidebar-list {
  .v-chip.x-small {
    font-size: 12px;
    height: 18px !important;
    font-weight: normal;
    border-radius: 2px;
    .v-chip__content {
      padding: 3px 6px;
    }
  }
  div[role=listitem].is-active {
    background-color: #E1F5FE;
  }
}
</style>

