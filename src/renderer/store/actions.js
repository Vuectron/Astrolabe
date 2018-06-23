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
          commit(types.SET_TOKEN, { token })
          commit(types.SET_GITHUB_STATE, { github })
          commit(types.TOGGLE_LOADING)
          resolve()
        } else {
          commit(types.TOGGLE_CONNECTING)
          reject()
        }
      })
  })
}

export const getLocalToken = ({ commit, dispatch, state }, payload) => {
  return new Promise((resolve, reject) => {
    storage.get('oauth2', (error, data) => {
      if (error) {
        commit(types.TOGGLE_CONNECTING)
        reject(error)
      }
      if (!_.isEmpty(data)) {
        const { token } = data
        if (token) {
          const github = new Github({
            token: data.token,
            auth: 'oauth'
          })
          commit(types.SET_TOKEN, { token })
          commit(types.SET_GITHUB_STATE, { github })
          commit(types.TOGGLE_LOADING)
          resolve(data)
        } else {
          commit(types.TOGGLE_CONNECTING)
          reject(error)
        }
      }
    })
  })
}

export const getUser = ({ commit, dispatch, state }, payload) => {
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
          dispatch('setUser', { user })
          resolve(user)
        } else {
          reject(error)
        }
      })
  })
}

export const getRepos = async ({ commit, dispatch, state }, user) => {
  const { github } = state.github
  user = user || state.github.user

  const githubUser = github.getUser(user.login)

  const getStarredRepos = () => {
    return new Promise((resolve, reject) => {
      githubUser.listStarredRepos((error, repos) => {
        if (error) {
          console.log(error)
          reject(error)
        }
        dispatch('initRepos', { repos })
        commit(types.TOGGLE_LOGIN)
        resolve(repos)
      })
    })
  }

  // fetch user from db
  const userInfo = await db.findOneUser(user.id)
  // fetch langGroup from db
  const langGroup = await db.fetchLangGroup()
  // fetch all repos from db into repos state
  const repos = await db.fetchAllRepos()

  console.group('Github getRepos Begin')
  console.log(userInfo)
  console.log(repos)
  console.groupEnd()

  if (_.isNull(userInfo) && _.isEmpty(langGroup) && _.isEmpty(repos)) {
    getStarredRepos()
  } else {
    const orderedLangGroup = _.orderBy(langGroup, 'count', 'desc')
    commit(types.SET_REPOS, { repos })
    commit(types.SET_GITHUB_STATE, { langGroup: orderedLangGroup })
    commit(types.TOGGLE_LOGIN)
  }
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
        commit(types.SET_GITHUB_STATE, { lazyRepos })
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
export const setRepos = makeAction('SET_REPOS')
export const filterByLanguage = makeAction('FILTER_BY_LANGUAGE')
export const orderedRepos = makeAction('ORDERED_REPOS')
export const setSearchQuery = makeAction('SET_SEARCH_QUERY')
export const setLangGroupDB = makeAction('SET_LANG_GROUP_DB')

// content actions
export const toggleLoadingRepos = makeAction('TOGGLE_LOADING_REPOS')
export const toggleLoadingReadme = makeAction('TOGGLE_LOADING_README')
export const setActiveRepo = makeAction('SET_ACTIVE_REPO')
export const setSelectedRepo = makeAction('SET_SELECTED_REPO')
export const setRepoReadme = makeAction('SET_REPO_README')
export const orderRepo = makeAction('ORDER_REPO')
