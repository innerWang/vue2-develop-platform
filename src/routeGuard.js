import router from '@/router';
import { getToken, clearDB } from '@/utils/auth';
import store from '@/store';

const whiteList = ['/login'];
const CHANGE_INITIAL_PASSWORD_PATH = '/changeinitialpassword';

// 待查： 初次登录时已经跳转成功后会有 /login ---> /login 的情况
router.beforeEach((to, from, next) => {
  const token = getToken();
  if (token) {
    if (to.path === '/login') {
      next({
        path: '/',
      });
    } else {
      if (!store.state.user.userCode) {
        if (to.path !== CHANGE_INITIAL_PASSWORD_PATH) {
          store.dispatch('user/getUserInfo').then((data) => {
            // 获取用户信息失败的处理
            if (data.error) {
              if (data.error.code === 'E411') {
                next({ path: CHANGE_INITIAL_PASSWORD_PATH });
              } else {
                clearDB();
                next({ path: '/login', replace: true });
              }
            } else {
              const redirect = decodeURIComponent(from.query.redirect || to.path);
              if (to.path === redirect) {
                next({ ...to, replace: true });
              } else {
                next({ path: redirect });
              }
            }
          });
        } else {
          next();
        }
      } else {
        next();
      }
    }
  } else {
    // 在免登陆白名单则直接继续，否则跳转回登录页
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next({ path: '/login' });
    }
  }
});
