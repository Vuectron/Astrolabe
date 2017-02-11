import * as types from '../mutation-types'

const state = {
  loadingRepos: false,
  loadingReadme: false,
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

  [types.ORDER_REPO] (state, {repoKey}) {
    state.repoKey = repoKey
    state.order = state.order * -1
  }
}

export default {
  state,
  mutations
}
