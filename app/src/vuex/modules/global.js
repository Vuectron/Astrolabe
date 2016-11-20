import * as types from '../mutation-types'

const state = {
  version: '0.0.1',
  limitCount: 0
}

const mutations = {
  [types.INCREASE_LIMIT] (state) {
    state.limitCount += 50
  }
}

export default {
  state,
  mutations
}
