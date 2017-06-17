import * as types from '../mutation-types'

const state = {
  version: '0.0.1',
  limitCount: 10,
  minLangCount: 1,
  isInfinite: false
}

const mutations = {
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
