import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/eduservice/user/login',
    method: 'post',
    data //这里是es6语法 "data":data 的简写，我们可以看到需要的参数就是data数据
  })
}

export function getInfo(token) {
  return request({
    url: '/eduservice/user/info',
    method: 'get',
    params: { token } //这里只需要一个参数token
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
