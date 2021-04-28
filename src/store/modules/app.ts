const state = {
  useName: 'sam'
}
const mutations = {
  change_name(state: { useName: String }, anotherName: String) {
    state.useName = anotherName
  }
}
const actions = {
  changeName(
    { commit, rootState }: { commit: Function; rootState: { job: String } },
    anotherName: String
  ) {
    if (rootState.job == 'web') {
      commit('change_name', anotherName)
    }
  },
  alertName({ state }: { state: { useName: String } }) {
    alert(state.useName)
  }
}
const getters = {
  localJobTitle(
    state: Object,
    getters: Object,
    rootState: { job: String },
    rootGetters: { jobTitle: String }
  ) {
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
