import _ from 'lodash'
import jetpack from 'fs-jetpack'
import { remote } from 'electron'
import db from '../../services/db'
import Constants from '../../utils/constants'
import * as types from '../mutation-types'

const userDataDir = remote.app.getPath('userData')

// initial state
const state = {
  github: '',
  user: {},
  repos: [],
  lazyRepos: [],
  langGroup: [],
  reposCount: '0',
  untaggedCount: '0',
  searchQuery: '',
  order: 1,
  activeLang: ''
}

// actions
const actions = {
  async initRepos ({ commit, state }, payload) {
    const { repos } = payload
    // insert repos
    let apiReposArray = []
    const initRepos = repos.map((v, i) => {
      const repo = {
        ...v,
        '_id': v.id,
        'repo_idx': parseInt(i),
        'owner_name': v.full_name.split('/').shift(),
        'repo_name': v.full_name.split('/').pop(),
        'downloads_url': v.html_url + '/archive/' + v.default_branch + '.zip',
        'language': v.language == null ? 'null' : v.language
      }
      db.findOneRepo(repo._id).then(doc => {
        _.isNull(doc) ? db.addRepo(repo, docs => {}) : db.updateRepo(repo)
      })
      apiReposArray.push(v.id)
      return repo
    })
    console.log('findOneAndUpdate [%d] repos', _.size(repos))

    // sync repos.db
    let diffRepos = []
    db.fetchAllRepos().then(dbRepos => {
      const dbReposArray = dbRepos.map(v => v._id)
      // looking for difference
      diffRepos = _.xor(apiReposArray, dbReposArray)
      if (_.size(diffRepos) > 0) {
        for (let diff in diffRepos) {
          if (diffRepos.hasOwnProperty(diff) && _.includes(dbReposArray, diffRepos[diff])) {
            // remove the difference repos
            db.removeRepo(diffRepos[diff])
          }
        }
      }
    })

    // build lang_group
    const getLangGroup = (repos) => {
      const devicons = Constants.DEVICONS
      const countedLangs = _.countBy(repos, 'language')
      const langGroup = Object.keys(countedLangs).map(v => {
        return {
          _id: v,
          lang: v,
          count: countedLangs[v],
          icon: devicons[v] || devicons['Default']
        }
      })
      // ordered by count desc & lang asc
      return _.orderBy(langGroup, ['count', 'lang'], ['desc', 'asc'])
    }

    const orderedLangs = getLangGroup(initRepos)

    // upsert the lang_group db
    orderedLangs.forEach((v, i) => {
      v._id = i + 1
      db.findOneLangGroup(v.lang).then(data => {
        if (_.isNull(data)) {
          db.addLangGroup(v, _ => {})
        } else {
          db.updateLangGroup(v)
        }
      })
    })

    commit(types.SET_GITHUB_STATE, {
      // set lang_group
      langGroup: orderedLangs,
      // set init repos
      repos: initRepos,
      // set repos count
      reposCount: _.toString(_.size(repos)),
      // set untagged count
      untaggedCount: _.toString(_.size(_.filter(repos, _.matches({ 'language': null }))))
    })
    return initRepos
  },
  async setUser ({ commit, state }, payload) {
    const { user } = payload
    db.findOneUser(user.id).then(res => {
      if (_.isNull(res)) {
        // when change user delete all db file
        jetpack
          .find(userDataDir, { matching: ['*.db'] })
          .forEach(jetpack.remove)
        db.addUser(user)
        commit(types.SET_GITHUB_STATE, { user })
      } else {
        db.updateUser(user)
        commit(types.SET_GITHUB_STATE, { user })
      }
    })
  }
}

// mutations
const mutations = {
  [types.SET_GITHUB_STATE] (state, payload) {
    Object.assign(state, payload)
  },

  [types.SET_REPOS] (state, {repos}) {
    state.repos = repos
    state.reposCount = _.toString(_.size(repos))
    state.untaggedCount = _.toString(_.size(_.filter(repos, _.matches({ 'language': 'null' }))))
  },

  [types.FILTER_BY_LANGUAGE] (state, {lang}) {
    state.lazyRepos = _.isNull(lang)
      ? state.repos
      : _.filter(state.repos, _.matches({ 'language': lang }))
    state.activeLang = lang
  },

  [types.ORDERED_REPOS] (state, {orderField}) {
    state.lazyRepos = state.order > 0
      ? _.orderBy(state.lazyRepos, orderField)
      : _.orderBy(state.lazyRepos, orderField, 'desc')
    state.order = state.order * -1
  },

  [types.SET_SEARCH_QUERY] (state, {searchQuery}) {
    state.lazyRepos = _.isNull(searchQuery)
      ? state.repos
      : _.filter(state.repos, function (o) {
        return _.includes(o.repo_name, searchQuery) || _.includes(o.description, searchQuery)
      })
  },

  [types.SET_LANG_GROUP] (state, payload) {
    const { langGroup } = state
    db.removeLangGroup()
    langGroup.forEach((v, i) => {
      v._id = i + 1
      db.addLangGroup(v, _ => {})
    })
  },

  [types.ADD_LANG_GROUP] (state, payload) {
    const { langGroup } = state
    const newTag = {
      _id: langGroup.length + 1,
      lang: payload,
      count: 0,
      icon: Constants.DEVICONS['Default']
    }
    langGroup.push(newTag)
    db.addLangGroup(newTag, _ => {})
  }
}

export default {
  state,
  actions,
  mutations
}
