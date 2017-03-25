import * as types from '../mutation-types'

const state = {
  loadingRepos: false,
  loadingReadme: false,
  repoReadme: '',
  activeRepo: {},
  repoKey: '',
  order: 1
}

const mutations = {
  [types.TOGGLE_LOADING_REPOS] (state) {
    state.loadingRepos = !state.loadingRepos
  },

  [types.TOGGLE_LOADING_README] (state) {
    state.loadingReadme = !state.loadingReadme
  },

  [types.SET_ACTIVE_REPO] (state, {repo}) {
    state.activeRepo = repo
  },

  [types.SET_REPO_README] (state, {repoReadme}) {
    state.repoReadme = repoReadme
  },

  [types.ORDER_REPO] (state, {repoKey}) {
    state.repoKey = repoKey
    state.order = state.order * -1
  }
}

export default {
  state,
  mutations
}
