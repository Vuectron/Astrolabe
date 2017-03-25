import * as types from '../mutation-types'

const state = {
  version: '0.0.1',
  limitCount: 10
}

const mutations = {
  [types.INCREASE_LIMIT] (state) {
    state.limitCount += 10
  }
}

export default {
  state,
  mutations
}
