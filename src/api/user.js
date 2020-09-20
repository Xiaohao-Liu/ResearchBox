var request =  require('../utils/request')
//登录
function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
//获取用户信息
function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

module.exports = {
    login,
    getUserInfo
  }
