/* eslint prefer-promise-reject-errors: ["error", {"allowEmptyReject": true}] */
import storage from 'electron-json-storage'
import * as types from '../mutation-types'

const state = {
  token: null,
  isConnecting: false,
  isLoading: false,
  isLogin: false
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
    return new Promise((resolve, reject) => {
      storage.remove('oauth2', (err) => {
        if (err) reject()
        state.isLoading = false
        state.isLogin = false
        resolve()
      })
    })
  }
}

export default {
  state,
  mutations
}
