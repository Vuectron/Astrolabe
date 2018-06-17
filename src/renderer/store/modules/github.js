import _ from 'lodash'
// import jetpack from 'fs-jetpack'
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
// mutations
const mutations = {
  [types.SET_GITHUB_STATE] (state, payload) {
    Object.assign(state, payload)
  },

  [types.SET_GITHUB] (state, {github}) {
    state.github = github
  },

  [types.SET_USER] (state, {user}) {
    console.log(userDataDir)
    state.user = user
    // db.findOneUser(user.id).then(res => {
    //   if (_.isNull(res)) {
    //     // when change user delete all db file
    //     jetpack.find(userDataDir, { matching: ['*.db'] }).forEach(jetpack.remove)
    //     db.addUser(user, user => {
    //       state.user = user
    //     })
    //   } else {
    //     state.user = user
    //     db.updateUser(user)
    //   }
    // })
  },

  [types.INIT_REPOS] (state, {repos}) {
    // insert repos
    let initRepos = []
    let apiReposArray = []
    for (let i in repos) {
      const repo = {
        '_id': repos[i].id,
        'repo_idx': parseInt(i),
        'owner_name': repos[i].full_name.split('/').shift(),
        'repo_name': repos[i].full_name.split('/').pop(),
        'description': repos[i].description,
        'stargazers_count': repos[i].stargazers_count,
        'forks_count': repos[i].forks_count,
        'html_url': repos[i].html_url,
        'clone_url': repos[i].clone_url,
        'git_url': repos[i].git_url,
        'downloads_url': repos[i].html_url + '/archive/' + repos[i].default_branch + '.zip',
        'created_at': repos[i].created_at,
        'updated_at': repos[i].updated_at,
        'language': repos[i].language == null ? 'null' : repos[i].language
      }
      initRepos.push(repo)
      db.findOneRepo(repo._id).then(doc => {
        _.isNull(doc) ? db.addRepo(repo, docs => {}) : db.updateRepo(repo)
      })
      apiReposArray.push(repos[i].id)
    }
    console.log('findOneAndUpdate [%d] repos', _.size(repos))

    // sync repos.db
    let diffRepos = []
    db.fetchAllRepos().then(dbRepos => {
      let dbReposArray = []
      for (let i in dbRepos) {
        dbReposArray.push(dbRepos[i]._id)
      }
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
    const countLangs = _.countBy(initRepos, 'language')

    const langGroup = []

    const devicons = Constants.DEVICONS

    for (let lang in countLangs) {
      if (countLangs.hasOwnProperty(lang)) {
        let langCount = {
          '_id': lang,
          'lang': lang,
          // 'count': _.toString(countLangs[lang]),
          'count': countLangs[lang],
          'icon': devicons[lang] || devicons['Default']
        }
        langGroup.push(langCount)
        db.findOneLangGroup(lang).then(doc => {
          if (_.isNull(doc)) {
            db.addLangGroup(langCount, docs => {})
          } else {
            db.updateLangGroup(langCount)
          }
        })
      }
    }

    // set lang_group
    state.langGroup = _.orderBy(langGroup, 'count', 'desc')

    // set init repos
    state.repos = initRepos

    // set repos count
    state.reposCount = _.toString(_.size(repos))

    // set untagged count
    state.untaggedCount = _.toString(_.size(_.filter(repos, _.matches({ 'language': null }))))
  },

  [types.SET_REPOS] (state, {repos}) {
    state.repos = repos
    state.reposCount = _.toString(_.size(repos))
    state.untaggedCount = _.toString(_.size(_.filter(repos, _.matches({ 'language': 'null' }))))
  },

  [types.SET_LAZY_REPOS] (state, {lazyRepos}) {
    state.lazyRepos = lazyRepos
  },

  [types.SET_LANG_GROUP] (state, {langGroup}) {
    state.langGroup = langGroup
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
  }
}

export default {
  state,
  mutations
}
