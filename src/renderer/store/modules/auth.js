/* eslint prefer-promise-reject-errors: ["error", {"allowEmptyReject": true}] */
import storage from 'electron-json-storage'
import * as types from '../mutation-types'

const state = {
  token: null,
  isConnecting: false,
  isLoading: false,
  isLogin: false
}

const actions = {
  userSignout ({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      storage.remove('oauth2', error => {
        if (error) reject(error)
        commit(types.USER_SIGNOUT)
        resolve()
      })
    })
  }
}

const mutations = {
  [types.SET_TOKEN] (state, {token}) {
    state.token = token
  },
  [types.TOGGLE_CONNECTING] (state) {
    state.isConnecting = !state.isConnecting
  },
  [types.TOGGLE_LOADING] (state) {
    state.isConnecting = false
    state.isLoading = !state.isLoading
  },
  [types.TOGGLE_LOGIN] (state) {
    state.isLoading = false
    state.isLogin = true
  },
  [types.USER_SIGNOUT] (state) {
    state.isLoading = false
    state.isLogin = false
  }
}

export default {
  state,
  actions,
  mutations
}
