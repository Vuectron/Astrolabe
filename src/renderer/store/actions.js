/* eslint prefer-promise-reject-errors: ["error", {"allowEmptyReject": true}] */
import _ from 'lodash'
// // import jetpack from 'fs-jetpack'
import request from 'superagent'
import Github from 'github-api'
import db from '../services/db'
import storage from 'electron-json-storage'

import * as types from './mutation-types'
import { md } from '../utils/helpers'

const makeAction = (type) => {
  return ({ commit }, ...args) => commit(type, ...args)
}

// auth actions, axios can not cors for now, use superagent instead.
export const getToken = ({ commit }, payload) => {
  const { authOptions, code } = payload
  const { hostname } = authOptions

  const url = `https://${hostname}/login/oauth/access_token`
  const postData = {
    'client_id': authOptions.clientId,
    'client_secret': authOptions.clientSecret,
    'code': code
  }

  commit(types.TOGGLE_CONNECTING)

  return new Promise((resolve, reject) => {
    request.post(url)
      .accept('application/json')
      .send(postData)
      .end((error, response) => {
        if (!error && response.statusCode === 200) {
          const token = response.body.access_token
          console.log(`github: token[${token}]`)
          const github = new Github({
            token: token,
            auth: 'oauth'
          })
          storage.set('oauth2', { code, token }, (error) => { if (error) throw error })
          commit(types.SET_TOKEN, {token})
          commit(types.SET_GITHUB, {github})
          commit(types.TOGGLE_LOADING)
          resolve()
        } else {
          commit(types.TOGGLE_CONNECTING)
          reject()
        }
      })
  })
}

export const getLocalToken = ({ dispatch, commit, state }, payload) => {
  return new Promise((resolve, reject) => {
    storage.get('oauth2', (error, data) => {
      if (error) {
        commit(types.TOGGLE_CONNECTING)
        reject()
      }
      if (!_.isEmpty(data)) {
        const { token } = data
        if (token) {
          const github = new Github({
            token: data.token,
            auth: 'oauth'
          })
          commit(types.SET_TOKEN, {token})
          commit(types.SET_GITHUB, {github})
          commit(types.TOGGLE_LOADING)
          resolve()
        } else {
          commit(types.TOGGLE_CONNECTING)
          reject()
        }
      }
    })
  })
}

export const getUser = ({ commit, state }, payload) => {
  const { token } = state.auth

  const url = 'https://api.github.com/user'

  return new Promise((resolve, reject) => {
    request.get(url)
      .accept('application/json')
      .auth('token', token)
      .end((error, response) => {
        if (!error && response.statusCode === 200) {
          const user = response.body
          console.group('Github User Group Begin')
          console.log(user)
          console.groupEnd('Github User Group End')
          commit(types.SET_USER, {user})
          resolve(user)
        } else {
          reject(error)
        }
      })
  })
}

export const getRepos = ({ commit, state }, user) => {
  const { github } = state.github
  user = user || state.github.user

  const githubUser = github.getUser(user.login)

  const getStarredRepos = () => {
    return new Promise((resolve, reject) => {
      githubUser.listStarredRepos((err, repos) => {
        if (err) {
          console.log(err)
        }
        commit(types.INIT_REPOS, {repos})
        commit(types.TOGGLE_LOGIN)
        resolve()
      })
    })
  }

  db.findOneUser(user.id).then(doc => {
    if (_.isNull(doc)) {
      getStarredRepos()
    } else {
      // fetch all repos into repos state
      db.fetchAllRepos().then(repos => {
        if (_.isEmpty(repos)) {
          getStarredRepos()
        } else {
          commit(types.SET_REPOS, {repos})
        }
      })
      db.fetchLangGroup().then(langGroup => {
        if (!_.isEmpty(langGroup)) {
          const orderedLangGroup = _.orderBy(langGroup, 'count', 'desc')
          commit(types.SET_LANG_GROUP, {orderedLangGroup})
        }
      })
    }
  })
  getStarredRepos()
}

export const showReadme = ({ commit, state }, repo) => {
  const { github } = state.github
  const { activeRepo } = state.content
  const repoSlug = `${repo.owner_name}_${repo.repo_name}`
  let renderMarkdown

  if (repo._id !== activeRepo._id) {
    commit(types.SET_ACTIVE_REPO, {repo})
    commit(types.TOGGLE_LOADING_README)

    storage.get(repoSlug, (error, data) => {
      if (error) console.error(error)
      if (!_.isEmpty(data)) {
        commit(types.SET_REPO_README, {repoReadme: data})
        commit(types.TOGGLE_LOADING_README)
      } else {
        const githubRepo = github.getRepo(repo.owner_name, repo.repo_name)
        const readmeUrl = 'https://api.github.com/repos/' + repo.owner_name + '/' + repo.repo_name + '/readme'
        request.get(readmeUrl)
          .accept('application/json')
          .end((err, res) => {
            if (!err && res) {
              githubRepo.getContents('master', res.body.name, true, (err, data) => {
                if (err) {
                  console.dir(err.status)
                  // TODO dealwith 404
                }
                // self.repoReadme = marked(data)
                renderMarkdown = md().render(data)
                commit(types.SET_REPO_README, {repoReadme: renderMarkdown})
                storage.set(repoSlug, renderMarkdown, (error) => { if (error) throw error })
                commit(types.TOGGLE_LOADING_README)
              })
            } else {
              console.log('Something went wrong fetching from GitHub', err)
            }
          })
      }
    })
  }
  commit(types.SET_SELECTED_REPO, {repoName: repo.repo_name})
}

export const reloadRepos = ({ commit, state }, isInfinite) => {
  const { limitCount } = state.global
  const { reposCount } = state.github
  if (limitCount > reposCount) return
  if (isInfinite) {
    commit(types.TOGGLE_IS_INFINITE)
    commit(types.INCREASE_LIMIT)
  }
  setTimeout(() => {
    db.fetchLazyRepos(limitCount)
      .then(lazyRepos => {
        commit(types.SET_LAZY_REPOS, {lazyRepos})
      })
    if (isInfinite) {
      commit(types.TOGGLE_IS_INFINITE)
    }
  }, 2000)
}

// global actions
export const increaseLimit = makeAction('INCREASE_LIMIT')
export const toggleIsInfinite = makeAction('TOGGLE_IS_INFINITE')

// login actions
export const toggleLoading = makeAction('TOGGLE_LOADING')
export const toggleLogin = makeAction('TOGGLE_LOGIN')
export const userSignout = makeAction('USER_SIGNOUT')

// sidebar actions
export const toggleSidebar = makeAction('TOGGLE_SIDEBAR')
export const setSidebar = makeAction('SET_SIDEBAR')

// github actions
export const setGithubState = makeAction('SET_GITHUB_STATE')
export const setGithub = makeAction('SET_GITHUB')
export const setUser = makeAction('SET_USER')
export const initRepos = makeAction('INIT_REPOS')
export const setRepos = makeAction('SET_REPOS')
export const setLazyRepos = makeAction('SET_LAZY_REPOS')
export const setLangGroup = makeAction('SET_LANG_GROUP')
export const filterByLanguage = makeAction('FILTER_BY_LANGUAGE')
export const orderedRepos = makeAction('ORDERED_REPOS')
export const setSearchQuery = makeAction('SET_SEARCH_QUERY')

// content actions
export const toggleLoadingRepos = makeAction('TOGGLE_LOADING_REPOS')
export const toggleLoadingReadme = makeAction('TOGGLE_LOADING_README')
export const setActiveRepo = makeAction('SET_ACTIVE_REPO')
export const setSelectedRepo = makeAction('SET_SELECTED_REPO')
export const setRepoReadme = makeAction('SET_REPO_README')
export const orderRepo = makeAction('ORDER_REPO')
