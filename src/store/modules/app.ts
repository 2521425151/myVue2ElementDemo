const state = {
  useName: 'sam'
}
const mutations = {
  change_name(state, anotherName) {
    state.useName = anotherName
  }
}
const actions = {
  changeName({ commit, rootState }, anotherName) {
    if (rootState.job == 'web') {
      commit('change_name', anotherName)
    }
  },
  alertName({ state }) {
    alert(state.useName)
  }
}
const getters = {
  localJobTitle(state, getters, rootState, rootGetters) {
    return rootGetters.jobTitle + ' aka ' + rootState.job
  }
}
// namespaced 属性，限定命名空间
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
