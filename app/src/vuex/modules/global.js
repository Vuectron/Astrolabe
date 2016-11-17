import * as types from '../mutation-types'

const state = {
  version: '0.0.1',
  open: '',
  docked: '',
  desktop: ''
}

const mutations = {
  [types.SET_SIDEBAR] (state, { isDesktop }) {
    state.open = isDesktop
    state.docked = isDesktop
    state.desktop = isDesktop
  },
  [types.TOGGLE_SIDEBAR] (state) {
    state.open = !state.open
  }
}

export default {
  state,
  mutations
}
