import * as types from '../mutation-types'

const state = {
  open: ''
}

const mutations = {
  [types.SET_SIDEBAR] (state, { isDesktop }) {
    console.log(isDesktop)
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
