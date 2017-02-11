import * as types from '../mutation-types'

const state = {
  connecting: false,
  loading: false,
  isLogin: false
}

const mutations = {
  [types.TOGGLE_CONNECTING] (state) {
    state.connecting = true
  },

  [types.TOGGLE_LOADING] (state) {
    state.connecting = !state.connecting
    state.loading = true
  },

  [types.TOGGLE_LOGIN] (state) {
    state.loading = !state.loading
    state.isLogin = true
  }
}

export default {
  state,
  mutations
}
