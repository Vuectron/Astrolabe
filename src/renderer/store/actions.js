/* eslint prefer-promise-reject-errors: ["error", {"allowEmptyReject": true}] */
import _ from 'lodash'
import request from 'superagent'
import Github from 'github-api'
import Color from 'color'
// import db from '../services/db'
import dataBase from '../services/dataBase'
import storage from 'electron-json-storage'

import * as types from './mutation-types'
import { md } from '../utils/helpers'

const Octokit = require('@octokit/rest')

const octokit = Octokit({
  auth: 'ab457c5beede96152b257c70a64feae9c13525ad',
  previews: ['symmetra']
})

const makeAction = (type) => {
  return ({ commit }, ...args) => commit(type, ...args)
}

// auth actions, axios can not cors for now, use superagent instead.
export const getToken = ({ commit }, payload) => {
  const { authOptions, code } = payload
  const { hostname, clientId, clientSecret } = authOptions
  // https://github.com/login/oauth/access_token
  const url = `https://${hostname}/login/oauth/access_token`
  const postData = {
    'client_id': clientId,
    'client_secret': clientSecret,
    'code': code
  }

  commit(types.TOGGLE_CONNECTING)

  console.log(postData)

  return new Promise((resolve, reject) => {
    request.post(url)
      .withCredentials()
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
      if (!_.isEmpty(data) && data.token) {
        const github = new Github({
          token: data.token,
          auth: 'oauth'
        })
        commit(types.SET_TOKEN, { token: data.token })
        commit(types.SET_GITHUB_STATE, { github })
        commit(types.TOGGLE_LOADING)
        resolve(data)
      } else {
        commit(types.TOGGLE_CONNECTING)
        reject(error)
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
          // console.group('Github User Group Begin')
          // console.log(user)
          // console.groupEnd('Github User Group End')
          dispatch('setUser', { user })
          resolve(user)
        } else {
          reject(error)
        }
      })
  })
}

export const getLocalUser = ({ commit, dispatch, state }, userId) => {
  dataBase.findOneUser(userId).then(async user => {
    console.log(user)
    if (user) {
      commit(types.SET_GITHUB_STATE, { user })
    }
  })
}

export const getRepos = async ({ commit, dispatch, state }, user) => {
  user = user || state.github.user
  const getStarredRepos = async (page = 1) => {
    const result = await octokit.activity.listReposStarredByUser({
      username: user.login,
      page
    })
    if (result && result.status === 200) {
      const repos = result.data
      commit(types.SET_GITHUB_STATE, { loadingRepos: true })
      const res = await dispatch('loadRepos', { repos })
      if (res && res.length > 0) {
        getStarredRepos(page + 1)
      } else {
        return
      }
      commit(types.TOGGLE_LOGIN)
    }
  }
  // fetch langGroup from db
  const langGroup = await dataBase.fetchAllLangGroup()
  // fetch all repos from db into repos state
  const allRepos = await dataBase.fetchAllRepos()

  console.group('Github getRepos Begin')
  console.log(langGroup)
  console.log(allRepos)
  console.groupEnd()

  // fetch local repos
  if (_.size(allRepos) === 0 || _.size(langGroup) === 0) {
    await getStarredRepos()
    // dispatch('bulidLangGroup')
  } else {
    commit(types.SET_REPOS, { repos: allRepos })
    commit(types.SET_GITHUB_STATE, { langGroup })
    commit(types.TOGGLE_LOGIN)
  }
}

export const getLocalRepos = async ({ commit, state }, isLogin) => {
  const repos = await dataBase.fetchAllRepos()
  commit(types.SET_GITHUB_STATE, { lazyRepos: repos })
  commit(types.SET_REPOS, { repos: repos })
  isLogin && commit(types.TOGGLE_LOGIN)
  return repos
}

export const showReadme = ({ commit, state }, repo) => {
  const { github } = state.github
  const { activeRepo, loadingReadme } = state.content

  if (repo._id === activeRepo._id) return

  commit(types.SET_CONTENT_STATE, { loadingReadme: true })

  const repoSlug = `${repo.owner_name}_${repo.repo_name}`
  let renderMarkdown

  const githubRepo = github.getRepo(repo.owner_name, repo.repo_name)
  const readmeUrl = 'https://api.github.com/repos/' + repo.owner_name + '/' + repo.repo_name + '/readme'

  const getReadme = () => {
    return request
      .get(readmeUrl)
      .accept('application/json')
      .timeout(30000)
      .then(res => {
        /* responded in time */
        githubRepo.getContents(
          'master',
          res.body.name,
          true,
          (err, data) => {
            if (err) {
              console.dir(err.status)
              // TODO dealwith 404
            }
            // self.repoReadme = marked(data)
            renderMarkdown = md().render(data)
            storage.set(repoSlug, renderMarkdown, error => {
              if (error) throw error
            })
            if (state.content.selectedRepo === repo.id) {
              commit(types.SET_REPO_README, { repoReadme: renderMarkdown })
              commit(types.SET_CONTENT_STATE, { loadingReadme: false })
            }
          }
        )
      }, err => {
        if (err.timeout) {
          console.log('Fetching repos timeout.', err)
        } else {
          console.log('Something went wrong fetching from GitHub', err)
        }
        commit(types.SET_CONTENT_STATE, { loadingReadme: false })
      })
  }

  commit(types.SET_ACTIVE_REPO, repo)
  commit(types.SET_SELECTED_REPO, { repoId: repo.id })
  if (repo._id !== activeRepo._id) {
    if (!loadingReadme) {
      commit(types.SET_CONTENT_STATE, { loadingReadme: true })
    }

    storage.get(repoSlug, (error, data) => {
      if (error) console.error(error)
      if (!_.isEmpty(data)) {
        commit(types.SET_REPO_README, { repoReadme: data })
        commit(types.SET_CONTENT_STATE, { loadingReadme: false })
      } else {
        getReadme()
      }
    })
  }
}

export const reloadRepos = ({ commit, state }, isInfinite) => {
  const { limitCount } = state.global
  const { reposCount } = state.github
  if (limitCount > parseInt(reposCount, 10)) return
  if (isInfinite) {
    commit(types.TOGGLE_IS_INFINITE)
    commit(types.INCREASE_LIMIT)
  }
  setTimeout(() => {
    // db.fetchLazyRepos(limitCount)
    //   .then(lazyRepos => {
    //     console.log(lazyRepos)
    //     commit(types.SET_GITHUB_STATE, { lazyRepos })
    //   })
    if (isInfinite) {
      commit(types.TOGGLE_IS_INFINITE)
    }
  }, 2000)
}

export const getLabels = async ({ commit, state }, user) => {
  user = user || state.github.user
  const getLabelsByRepo = async () => {
    const result = await octokit.issues.listLabelsForRepo({
      owner: user.login,
      repo: 'astrolabe-tags'
    })
    if (result && result.status === 200) {
      const labels = result.data
      console.log(labels)
      if (labels) {
        return labels.map(label => {
          const hexColor = `#${label.color}`
          const color = Color(hexColor)
          return {
            ...label,
            color: hexColor,
            colorIsLight: color.isLight()
          }
        })
      }
    }
  }
  const newTags = await getLabelsByRepo()
  const tags = await dataBase.setTags(newTags)
  commit(types.SET_GITHUB_STATE, { tags })
}

export const createLabel = async ({ commit, state }, { user, tag }) => {
  user = user || state.github.user
  const { name, color, description } = tag
  try {
    await octokit.issues.createLabel({
      owner: user.login,
      repo: 'astrolabe-tags',
      name,
      color,
      description
    })
  } catch (error) {
    console.log(error)
  }
}

// global actions
export const setGlobalState = makeAction('SET_GLOBAL_STATE')
export const increaseLimit = makeAction('INCREASE_LIMIT')
export const toggleIsInfinite = makeAction('TOGGLE_IS_INFINITE')

// login actions
export const toggleLoading = makeAction('TOGGLE_LOADING')
export const toggleLogin = makeAction('TOGGLE_LOGIN')
export const userSignout = makeAction('USER_SIGNOUT')

// sidebar actions
export const toggleSidebar = makeAction('TOGGLE_SIDEBAR')
export const setSidebar = makeAction('SET_SIDEBAR_STATE')

// github actions
export const setGithubState = makeAction('SET_GITHUB_STATE')
export const setRepos = makeAction('SET_REPOS')
export const filterByLanguage = makeAction('FILTER_BY_LANGUAGE')
export const orderedRepos = makeAction('ORDERED_REPOS')
export const setSearchQuery = makeAction('SET_SEARCH_QUERY')
export const setLangGroup = makeAction('SET_LANG_GROUP')

// content actions
export const toggleLoadingReadme = makeAction('TOGGLE_LOADING_README')
export const setActiveRepo = makeAction('SET_ACTIVE_REPO')
export const setSelectedRepo = makeAction('SET_SELECTED_REPO')
export const setRepoReadme = makeAction('SET_REPO_README')
export const orderRepo = makeAction('ORDER_REPO')
