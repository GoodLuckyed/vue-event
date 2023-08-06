import request from '@/utils/request'
// 封装的是具体的接口请求方法
export const registerAPI = ({ username, password, repassword }) => {
  return request({
    url: '/api/reg',
    method: 'post',
    data: {
      username: username,
      password: password,
      repassword: repassword
    }
  })
}

export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'post',
    data: {
      username: username,
      password: password
    }
  })
}
