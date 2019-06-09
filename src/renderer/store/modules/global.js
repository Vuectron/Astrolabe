import * as types from '../mutation-types'

const state = {
  version: '0.0.1',
  limitCount: 10,
  minLangCount: 0,
  isInfinite: false,
  windowSize: {}
}

const mutations = {
  [types.SET_GLOBAL_STATE] (state, payload) {
    Object.assign(state, payload)
  },

  [types.INCREASE_LIMIT] (state) {
    state.limitCount += 10
  },

  [types.TOGGLE_IS_INFINITE] (state) {
    state.isInfinite = !state.isInfinite
  }
}

export default {
  state,
  mutations
}
