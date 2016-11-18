import * as types from './mutation-types'

export const toggleSidebar = ({ commit }) => {
  commit(types.TOGGLE_SIDEBAR)
}

export const setSidebar = ({ commit }, isDesktop) => {
  commit(types.SET_SIDEBAR, isDesktop)
}
