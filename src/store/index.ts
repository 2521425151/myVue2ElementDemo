import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 使用 require.context 动态引入 vuex modules
const modulesFiles = require.context('./modules', true, /\.ts$/)
const modules = modulesFiles.keys().reduce((module: any, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  module[moduleName] = value.default
  return module
}, {})

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules
})
