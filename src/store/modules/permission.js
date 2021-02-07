// 主要用于计算受控路由
import {
  constantRoutes,
  generateDynamicRouter,
  generateDynamicMenu,
} from '@/router/asyncGenerateRoutes';

const state = {
  // 所有可访问的路由
  accessRoutes: [],
  // 所有需要进行权限判断的路由过滤后的集合
  controlledRoutes: [],
  // 左侧菜单栏使用的菜单
  navMenu: [],
};

const mutations = {
  SET_STATE: (state, { routes, navMenu }) => {
    Object.assign(state, {
      controlledRoutes: routes,
      accessRoutes: constantRoutes.concat(routes),
      navMenu,
    });
  },
};

const actions = {
  generateRoutes: ({ commit }, { menus }) => {
    return new Promise((resolve) => {
      let asyncRoutes = [];
      // 1. 生成路由
      asyncRoutes = generateDynamicRouter(menus);
      // 2. 生成菜单
      const navMenu = generateDynamicMenu(menus);
      // 3. 修改本地存储的路由信息
      commit('SET_STATE', { routes: asyncRoutes, navMenu });
      // 4. 返回生成的异步路由，添加到 vue-router 中去
      resolve(asyncRoutes);
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
