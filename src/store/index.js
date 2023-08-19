import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoSAPI } from '@/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 1. 用来存储登录成功之后，得到的 token
    token: '',
    // 定义用户信息对象
    userInfo: {}
  },
  getters: {
    username: state => state.userInfo.username, // 用户名
    nickname: state => state.userInfo.nickname, // 昵称
    user_pic: state => state.userInfo.user_pic // 用户头像
  },
  mutations: {
    // 2. 更新 token 的 mutation 函数
    updateToken (state, newToken) {
      state.token = newToken
    },
    // 更新用户信息
    updataUserInfo (state, info) {
      state.userInfo = info
    }
  },
  actions: {
    // 定义初始化用户基本信息的 action 函数
    async initUserInfo (state) {
      const { data: res } = await getUserInfoSAPI()
      if (res.code === 0) {
        state.commit('updataUserInfo', res.data)
      }
    }
  },
  modules: {
  },
  plugins: [
    createPersistedState() // 注入持久化插件
  ]
})
