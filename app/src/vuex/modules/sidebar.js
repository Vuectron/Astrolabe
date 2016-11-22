import * as types from '../mutation-types'

const state = {
  open: '',
  searchQuery: '',
  filterFields: [
    'owner_name',
    'repo_name',
    'description',
    'language'
  ]
}

const mutations = {
  [types.SET_SIDEBAR] (state, { isDesktop }) {
    console.log(isDesktop)
    state.open = isDesktop
  },
  [types.TOGGLE_SIDEBAR] (state) {
    state.open = !state.open
  },
  [types.SET_SEARCH_QUERY] (state, searchQuery) {
    if (state.filterFields.length === 1) {
      state.filterFields = [
        'owner_name',
        'repo_name',
        'description',
        'language'
      ]
    }
    state.searchQuery = searchQuery
  },
  [types.FILTER_BY_LANGUAGE] (state, searchQuery) {
    state.filterFields = ['language']
    state.searchQuery = searchQuery
  }
}

export default {
  state,
  mutations
}
