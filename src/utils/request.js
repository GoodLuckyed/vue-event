import axios from 'axios'
import store from '@/store/index'
import router from '@/router'
import { Message } from 'element-ui'
// 创建一个自定的axios方法(比原axios多了个基地址)
// axios函数请求的url地址前面会被拼接基地址, 然后axios请求baseURL+url后台完整地址

export const baseURL = 'http://big-event-vue-api-t.itheima.net'
const myAxios = axios.create({
  baseURL
})

export default myAxios

// 添加请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    // 在请求头中携带token 注解和登录页面不需要携带token
    if (store.state.token) {
      config.headers.Authorization = store.state.token
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 定义响应拦截器  （token过期处理）
myAxios.interceptors.response.use(
  function (response) {
    // 响应状态码为 2xx 时触发成功的回调，形参中的 response 是“成功的结果”
    return response
  },
  function (error) {
    // 响应状态码不是 2xx 时触发失败的回调，形参中的 error 是“失败的结果”
    if (error.response.status === 401) {
      // 清除vuex中的token值和用户信息
      store.commit('updateToken', '')
      store.commit('updataUserInfo', {})
      // 跳转到登录页
      router.push('/login')
      Message.error('身份已过期,请重新登录！')
    }
    // return Promise.reject(error)
    return new Promise((resolve, reject) => {
      reject(error)
    })
  })
