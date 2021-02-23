const { login, getUserInfo } =require('../api/user')

const { getToken, setToken, removeToken } =require('../utils/auth')
const { resetRouter } =require('../router')
const state = {
  token: getToken(),
  //用户信息
  userInfo: {}
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
  }
}
const actions = {
  //登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },
  //退出登录
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      try {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  },
  //获取用户信息
  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then((res) => {
        const userInfo = res.data || {}
        commit('SET_USER_INFO', userInfo)
        resolve(userInfo)
      }).catch(err => {
        reject(err)
      })
    })
  },
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },
}

module.exports ={
  namespaced: true,
  state,
  mutations,
  actions
}
