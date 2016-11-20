import * as types from './mutation-types'

// global actions
export const increaseLimit = ({ commit }) => {
  commit(types.INCREASE_LIMIT)
}

// login actions
export const toggleConnecting = ({ commit }) => {
  commit(types.TOGGLE_CONNECTING)
}
export const toggleLoading = ({ commit }) => {
  commit(types.TOGGLE_LOADING)
}
export const toggleLogin = ({ commit }) => {
  commit(types.TOGGLE_LOGIN)
}

// sidebar actions
export const toggleSidebar = ({ commit }) => {
  commit(types.TOGGLE_SIDEBAR)
}
export const setSidebar = ({ commit }, data) => {
  commit(types.SET_SIDEBAR, data)
}

// github actions
export const setToken = ({ commit }, data) => {
  commit(types.SET_TOKEN, data)
}
export const setGithub = ({ commit }, data) => {
  commit(types.setUser, data)
}
export const setUser = ({ commit }, data) => {
  commit(types.SET_USER, data)
}
export const initRepos = ({ commit }, data) => {
  commit(types.INIT_REPOS, data)
}
export const setRepos = ({ commit }, data) => {
  commit(types.SET_REPOS, data)
}
export const setLazyRepos = ({ commit }, data) => {
  commit(types.SET_LAZY_REPOS, data)
}
export const setLangGroup = ({ commit }, data) => {
  commit(types.SET_LANG_GROUP, data)
}
