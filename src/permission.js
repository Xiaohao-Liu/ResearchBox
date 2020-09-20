import router from '../researchpages/src/router'
import { getToken } from '@/utils/auth'
import store from './store'
//设置白名单,不进行拦截
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  const hasToken = getToken()
  //检查是否有token
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      //刷新页面的时候，vuex的hasUserInfo就不存在了，需要重新请求用户信息
      const hasUserInfo = Object.keys(store.getters.userInfo).length > 0
      if (!hasUserInfo) {
        try {
          await store.dispatch('user/getUserInfo')
          next({ ...to, replace: true })
        } catch (error) {
          //如果请求失败，删除token，跳转登录页面
          await store.dispatch('user/resetToken')
          next('/login')
        }
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})

