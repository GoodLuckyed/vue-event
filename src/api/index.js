import request from '@/utils/request'
// 封装的是具体的接口请求方法
export const registerAPI = () => {
  return request({
    url: '/api/reg',
    method: 'post',
    data: {
      username: 'lidongxu01',
      password: '666666',
      repassword: '666666'
    }
  })
}
