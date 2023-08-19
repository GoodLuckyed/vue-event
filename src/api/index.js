import request from '@/utils/request'
// 封装的是具体的接口请求方法
/**
 *  注册接口方法
 * @param username
 * @param password
 * @param repassword
 * @returns {Promise<AxiosResponse<any>>}
 */
export const registerAPI = ({
  username,
  password,
  repassword
}) => {
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

/**
 *  登录接口方法
 * @param username
 * @param password
 * @returns {Promise<AxiosResponse<any>>}
 */
export const loginAPI = ({
  username,
  password
}) => {
  return request({
    url: '/api/login',
    method: 'post',
    data: {
      username: username,
      password: password
    }
  })
}

/**
 *  获取用户信息接口方法
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getUserInfoSAPI = () => {
  return request({
    url: '/my/userinfo',
    method: 'get'
  })
}

/**
 *  获取-侧边栏数据接口方法
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getMenusAPI = () => {
  return request({
    url: '/my/menus',
    method: 'get'
  })
}

/**
 * 更新用户信息接口方法
 * @param id
 * @param username
 * @param nickname
 * @param email
 * @param user_pic
 * @returns {Promise<AxiosResponse<any>>}
 */
// eslint-disable-next-line camelcase
export const updateUserInfoAPI = ({ id, username, nickname, email, user_pic }) => {
  return request({
    url: '/my/userinfo',
    method: 'put',
    data: {
      id: id,
      username: username,
      nickname: nickname,
      email: email,
      user_pic: user_pic
    }
  })
}

/**
 * 更新用户头像接口方法
 * @param avatar
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateAvatarAPI = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'patch',
    data: {
      avatar: avatar
    }
  })
}

/**
 * 更新用户密码接口方法
 * @param old_pwd
 * @param new_pwd
 * @param re_pwd
 * @returns {Promise<AxiosResponse<any>>}
 */
// eslint-disable-next-line camelcase
export const updatePwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'patch',
    data: {
      old_pwd: old_pwd,
      new_pwd: new_pwd,
      re_pwd: re_pwd
    }
  })
}

/**
 *  获取文章接口分类
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getArtCateListAPI = () => {
  return request({
    url: '/my/cate/list',
    method: 'get'
  })
}

/**
 * 添加文章分类的接口方法
 * @param cate_name
 * @param cate_alias
 * @returns {Promise<AxiosResponse<any>>}
 */
// eslint-disable-next-line camelcase
export const addArtCateAPI = ({ cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/add',
    method: 'post',
    data: {
      cate_name: cate_name,
      cate_alias: cate_alias
    }
  })
}

/**
 * 更新文章分类接口方法
 * @param id
 * @param cate_name
 * @param cate_alias
 * @returns {Promise<AxiosResponse<any>>}
 */
// eslint-disable-next-line camelcase
export const updateArtCateAPI = ({ id, cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/info',
    method: 'put',
    data: {
      id: id,
      cate_name: cate_name,
      cate_alias: cate_alias
    }
  })
}

/**
 * 删除分类接口方法
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const delArtCateAPI = (id) => {
  return request({
    url: '/my/cate/del',
    method: 'delete',
    params: {
      id: id
    }
  })
}

/**
 * 发表文章接口方法
 * @param fd
 * @returns {Promise<AxiosResponse<any>>}
 */
export const uploadArticleAPI = (fd) => {
  return request({
    url: '/my/article/add',
    method: 'post',
    data: fd // 参数要的是表单对象, 不能写普通对象, axios内部会判断, 如果是表单对象, 传递的请求体会设置Content-Type: form-data与后端对应
  })
}

/**
 * 获取文章列表接口方法
 * @param pagenum
 * @param pagesize
 * @param cate_id
 * @param state
 * @returns {Promise<AxiosResponse<any>>}
 */
// eslint-disable-next-line camelcase
export const getArticleListAPI = ({ pagenum, pagesize, cate_id, state }) => {
  return request({
    url: '/my/article/list',
    method: 'get',
    params: {
      pagenum: pagenum,
      pagesize: pagesize,
      cate_id: cate_id,
      state: state
    }
  })
}

/**
 * 获取文章详情接口方法
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getArticleDetailFn = (id) => {
  return request({
    url: '/my/article/info',
    method: 'get',
    params: {
      id: id
    }
  })
}

/**
 * 删除文章接口方法
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const delArticleAPI = (id) => {
  return request({
    url: '/my/article/info',
    method: 'delete',
    params: {
      id: id
    }
  })
}
