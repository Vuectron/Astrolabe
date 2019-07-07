import * as types from '../mutation-types'
import { cloneDeep } from 'lodash'

import dataBase from '../../services/dataBase'

const state = {
  loadingReadme: false,
  repoReadme: '',
  activeRepo: {},
  selectedRepo: '',
  repoKey: '',
  order: 1
}

const actions = {
  async setRepoTags ({ commit, dispatch, state }, payload) {
    const { activeRepo } = state
    const { tags } = payload

    const cloneRepo = cloneDeep(activeRepo)
    cloneRepo._tags = tags
    commit(types.SET_ACTIVE_REPO, cloneRepo)

    console.group('---')
    await dataBase.updateRepoTags(activeRepo.id, tags)
    const res = await dataBase.setTagCount(activeRepo.id, tags)
    console.groupEnd()
    commit(types.SET_GITHUB_STATE, { tags: res })
    dispatch('getLocalRepos', false)
    return cloneRepo
  }
}

const mutations = {
  [types.SET_CONTENT_STATE] (state, payload) {
    Object.assign(state, payload)
  },

  [types.TOGGLE_LOADING_README] (state) {
    state.loadingReadme = !state.loadingReadme
  },

  [types.SET_ACTIVE_REPO] (state, repo) {
    state.activeRepo = repo
  },

  [types.SET_SELECTED_REPO] (state, { repoId }) {
    state.selectedRepo = repoId
  },

  [types.SET_REPO_README] (state, { repoReadme }) {
    state.repoReadme = repoReadme
  },

  [types.ORDER_REPO] (state, { repoKey }) {
    state.repoKey = repoKey
    state.order = state.order * -1
  }
}

export default {
  state,
  actions,
  mutations
}
