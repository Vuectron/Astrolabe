import * as types from '../mutation-types'

const state = {
  open: '',
  filterFields: [
    'owner_name',
    'repo_name',
    'description',
    'language'
  ]
}

const mutations = {
  [types.SET_SIDEBAR_STATE] (state, { isDesktop }) {
    state.open = isDesktop
  },
  [types.TOGGLE_SIDEBAR] (state) {
    state.open = !state.open
  }
}

export default {
  state,
  mutations
}
