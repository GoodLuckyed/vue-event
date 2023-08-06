import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 1. 用来存储登录成功之后，得到的 token
    token: ''
  },
  getters: {
  },
  mutations: {
    // 2. 更新 token 的 mutation 函数
    updateToken (state, newToken) {
      state.token = newToken
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [
    createPersistedState() // 注入持久化插件
  ]
})
