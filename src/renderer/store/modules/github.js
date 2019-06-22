import _ from 'lodash'
// import jetpack from 'fs-jetpack'
// import { remote } from 'electron'
// import db from '../../services/db'
import dataBase from '../../services/dataBase'
// import Constants from '../../utils/constants'
import * as types from '../mutation-types'

// const userDataDir = remote.app.getPath('userData')

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
  activeLang: '',
  loadingRepos: false
}

// actions
const actions = {
  async loadRepos ({ commit, dispatch, state }, payload) {
    const { repos } = payload
    // loading finish
    if (_.size(repos) === 0) {
      commit(types.SET_GITHUB_STATE, {
        lazyRepos: state.repos,
        loadingRepos: false
      })
      // dispatch('bulidLangGroup')
      return repos
    }
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
      dataBase.findOneRepo(v.id).then(res => {
        _.isUndefined(res) ? dataBase.addRepo(repo) : dataBase.updateRepo(repo)
      })
      apiReposArray.push(v.id)
      return repo
    })
    console.log('findOneAndUpdate [%d] repos', _.size(repos))

    // sync repos.db
    // let diffRepos = []
    // dataBase.fetchAllRepos().then(dbRepos => {
    //   console.log(dbRepos)
    //   const dbReposArray = dbRepos.map(v => v._id)
    //   // looking for difference
    //   diffRepos = _.xor(apiReposArray, dbReposArray)
    //   if (_.size(diffRepos) > 0) {
    //     for (let diff in diffRepos) {
    //       if (diffRepos.hasOwnProperty(diff) && _.includes(dbReposArray, diffRepos[diff])) {
    //         // remove the difference repos
    //         dataBase.removeRepo(diffRepos[diff])
    //       }
    //     }
    //   }
    // })

    const mergedRepos = [...state.repos, ...initRepos]

    commit(types.SET_REPOS, { repos: mergedRepos })
    return initRepos
  },
  // build lang_group
  // async bulidLangGroup ({ commit, state }, payload) {
  //   const { repos } = state
  //   const devicons = Constants.DEVICONS
  //   const countedLangs = _.countBy(repos, 'language')
  //   const langGroup = Object.keys(countedLangs).map((v, i) => {
  //     return {
  //       lang: v,
  //       count: countedLangs[v],
  //       icon: devicons[v] || devicons['Default']
  //     }
  //   })
  //   // ordered by count desc & lang asc
  //   const orderedLangGroup = _.orderBy(langGroup, ['count', 'lang'], ['desc', 'asc'])
  //   // upsert the lang_group db
  //   orderedLangGroup.forEach((v, i) => {
  //     db.findOneLangGroup(v.lang).then(data => {
  //       if (_.isNull(data)) {
  //         v._id = i + 1
  //         db.addLangGroup(v, _ => {})
  //       } else {
  //         db.updateLangGroup(v)
  //       }
  //     })
  //   })
  //   commit(types.SET_GITHUB_STATE, { langGroup: orderedLangGroup })
  // },
  async setUser ({ commit, state }, payload) {
    const { user } = payload
    dataBase.findOneUser(user.id).then(async res => {
      console.log(res)
      if (_.isUndefined(res)) {
        await dataBase.addUser(user)
        commit(types.SET_GITHUB_STATE, { user })
      } else {
        await dataBase.updateUser(user)
        commit(types.SET_GITHUB_STATE, { user })
      }
    })
  }
  // async addLangGroup ({ commit, state }, payload) {
  //   const { langGroup } = state
  //   const newTag = {
  //     _id: langGroup.length + 1,
  //     lang: payload,
  //     count: 0,
  //     icon: Constants.DEVICONS['Default']
  //   }
  //   commit(types.ADD_LANG_GROUP, { newTag })
  //   const res = db.addLangGroup(newTag, _ => {})
  //   return res
  // }
}

// mutations
const mutations = {
  [types.SET_GITHUB_STATE] (state, payload) {
    Object.assign(state, payload)
  },

  [types.SET_REPOS] (state, { repos }) {
    state.repos = repos
    state.reposCount = _.toString(_.size(repos))
    state.untaggedCount = _.toString(_.size(_.filter(repos, _.matches({ 'language': 'null' }))))
  },

  [types.FILTER_BY_LANGUAGE] (state, { lang }) {
    state.repos = _.isNull(lang)
      ? state.lazyRepos
      : _.filter(state.lazyRepos, _.matches({ 'language': lang }))
    state.activeLang = lang
  },

  [types.ORDERED_REPOS] (state, { orderField }) {
    state.repos = state.order > 0
      ? _.orderBy(state.repos, orderField)
      : _.orderBy(state.repos, orderField, 'desc')
    state.order = state.order * -1
  },

  [types.SET_SEARCH_QUERY] (state, { searchQuery }) {
    state.searchQuery = searchQuery
    state.repos = _.isNull(searchQuery) || searchQuery === ''
      ? state.lazyRepos
      : _.filter(state.repos, function (o) {
        return _.includes(o.repo_name, searchQuery) || _.includes(o.description, searchQuery)
      })
  },

  // [types.SET_LANG_GROUP] (state, payload) {
  //   const { langGroup } = state
  //   db.removeLangGroup()
  //   langGroup.forEach((v, i) => {
  //     v._id = i + 1
  //     db.addLangGroup(v, _ => {})
  //   })
  // },

  [types.ADD_LANG_GROUP] (state, payload) {
    state.langGroup.push(payload.newTag)
  }
}

export default {
  state,
  actions,
  mutations
}
