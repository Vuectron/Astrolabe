import _ from 'lodash'
import request from 'superagent'
import Github from 'github-api'
import db from '../services/db'
import storage from 'electron-json-storage'

import * as types from './mutation-types'

const makeAction = (type) => {
  return ({ commit }, ...args) => commit(type, ...args)
}

// global actions
export const increaseLimit = makeAction('INCREASE_LIMIT')

// auth actions, axios can not cors for now, use superagent instead.
export const getToken = ({ commit, state }, payload) => {
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
        }
      })
  })
}

export const getLocalToken = ({ dispatch, commit, state }, payload) => {
  storage.get('oauth2', (error, data) => {
    const { token } = data
    if (token) {
      const github = new Github({
        token: data.token,
        auth: 'oauth'
      })
      commit(types.TOGGLE_LOADING)
      commit(types.SET_TOKEN, {token})
      commit(types.SET_GITHUB, {github})
      dispatch('getRepos').then(() => {
        dispatch('getUser').then(() => {
        })
      })
    }
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
          commit(types.SET_USER, {user})
          resolve()
        }
      })
  })
}

export const getRepos = ({ commit, state }, payload) => {
  const { github, user } = state.github

  const githubUser = github.getUser(user.login)

  db.findOneUser(user.id).then(doc => {
    if (_.isNull(doc)) {
      return new Promise((resolve, reject) => {
        githubUser.getStarredRepos((err, repos) => {
          commit(types.INIT_REPOS, repos)
          commit(types.TOGGLE_LOGIN)
          resolve()
        })
      })
    } else {
      // fetch all repos into repos state
      db.fetchAllRepos().then(repos => {
        if (_.isEmpty(repos)) {
          return new Promise((resolve, reject) => {
            githubUser.getStarredRepos((err, repos) => {
              commit(types.INIT_REPOS, repos)
              commit(types.TOGGLE_LOGIN)
              resolve()
            })
          })
        } else {
          commit(types.SET_REPOS, repos)
        }
      })
      db.fetchLangGroup().then(langGroup => {
        if (!_.isEmpty(langGroup)) {
          commit(types.SET_LANG_GROUP, langGroup)
        }
      })
    }
  })
  return new Promise((resolve, reject) => {
    githubUser.getStarredRepos((err, repos) => {
      commit(types.INIT_REPOS, user, repos)
      commit(types.TOGGLE_LOGIN)
      resolve()
    })
  })
}

export const loginRequest = makeAction('LOGIN_REQUEST')
export const loginSuccess = makeAction('LOGIN_SUCCESS')
export const loginFailure = makeAction('LOGIN_FAILURE')

// login actions
export const toggleLoading = makeAction('TOGGLE_LOADING')
export const toggleLogin = makeAction('TOGGLE_LOGIN')

// sidebar actions
export const toggleSidebar = makeAction('TOGGLE_SIDEBAR')
export const setSidebar = makeAction('SET_SIDEBAR')

// github actions
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
export const setRepoReadme = makeAction('SET_REPO_README')
export const orderRepo = makeAction('ORDER_REPO')
