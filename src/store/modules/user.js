import axios from '@/utils/axios';
import { message, Modal } from 'ant-design-vue';
import router, { resetRouter } from '@/router';
import { setToken } from '@/utils/auth';
import { redirectToLogin } from '@/utils/helpers';

const state = {
  isLoginLoading: false,
  // 用户Id，管理员用户的是 'root'，其余是 uuid
  userCode: '',
  // 登录用的操作员号(工号)
  userNo: '',
  // 右上角显示的用户名
  userName: '',
  // 用户对应的权限列表
  permissions: [],
  token: '',
};

const mutations = {
  SET_ISLOGINLOADING: (state, payload) => {
    state.isLoginLoading = payload;
  },
  SET_STATE: (state, payload) => {
    Object.assign(state, payload);
  },
  SET_TOKEN: (state, payload) => {
    state.token = payload;
  },
};

const actions = {
  login: async ({ commit }, { payload, callback }) => {
    try {
      await commit('SET_ISLOGINLOADING', true);
      const { token, isFirstLogin } = await axios({
        url: 'login',
        data: payload,
      });
      if (token) {
        await commit('SET_TOKEN', token);
        setToken(token);
        typeof callback === 'function' && (await callback(isFirstLogin));
      } else {
        message.error('无效的token!');
      }
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    } finally {
      await commit('SET_ISLOGINLOADING', false);
    }
  },
  getUserInfo: async ({ commit, dispatch }) => {
    try {
      const data = await axios({
        url: 'getUserInfo',
      });
      await commit('SET_STATE', data);
      const userAsyncMenus = await dispatch('getUserMenu');
      // 计算路由，动态增加路由
      resetRouter();
      const filteredRoutes = await dispatch(
        {
          type: 'permission/generateRoutes',
          menus: userAsyncMenus,
        },
        {
          root: true,
        }
      );
      router.addRoutes(filteredRoutes);
      // 获取数据字典查找表
      dispatch('dic/getDicLUT', null, { root: true });
      // 获取菜单列表
      dispatch('menu/getMenuTree', null, { root: true });
      return { error: null };
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
      return { error: e };
    }
  },
  logout: ({ dispatch }) => {
    redirectToLogin(0);
    dispatch('tags/delAllViews', null, { root: true });
  },
  getPersonalSettings: async ({ state }, { callback }) => {
    try {
      const { userCode } = state;
      const data = await axios({
        url: 'getPersonalSettings',
        data: { userCode },
      });
      if (typeof callback === 'function') {
        callback(data);
      }
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    }
  },
  setPersonalSettings: async (_, { payload, callback }) => {
    try {
      await axios({
        url: 'setPersonalSettings',
        data: payload,
      });
      message.success('操作成功！');
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    } finally {
      // 此处 callback 主要是为了 loading
      if (typeof callback === 'function') {
        callback();
      }
    }
  },
  changePassword: async (_, { payload, callbackOk, callback }) => {
    try {
      await axios({
        url: 'updatePassword',
        data: payload,
      });
      Modal.success({
        title: '修改密码成功，请重新登录',
        onOk: callbackOk,
      });
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    } finally {
      if (typeof callback === 'function') {
        callback();
      }
    }
  },
  getUserMenu: () => {
    return new Promise((resolve, reject) => {
      axios({
        url: 'getUserMenu',
      })
        .then(({ list }) => {
          resolve(list || []);
        })
        .catch(reject);
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
