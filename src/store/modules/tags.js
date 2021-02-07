const state = {
  // 保存的是每一个 route，对应用户访问过的页面
  visitedViews: [],
  // 只保存 route.name，对应实际需要 keep-alive 的路由，
  // 若需要缓存则定义路由时必须要定义 name 属性，且与组件的 name 属性一致
  cachedViews: [],
};

const mutations = {
  INIT_VISITED_VIEWS: (state, routes) => {
    routes.forEach((r) => {
      if (state.visitedViews.some((v) => v.path === r.path)) return;
      state.visitedViews.push({ ...r, title: r.meta.title || 'name-placeholder' });
    });
  },
  ADD_VISITED_VIEW: (state, route) => {
    if (state.visitedViews.some((v) => v.path === route.path)) return;
    state.visitedViews.push({ ...route, title: route.meta.title || 'name-placeholder' });
  },
  ADD_CACHED_VIEW: (state, route) => {
    if (state.cachedViews.indexOf(route.name) !== -1) return;
    if (!route.meta.noCache) {
      state.cachedViews.push(route.name);
    }
  },

  DEL_VISITED_VIEW: (state, route) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === route.path) {
        state.visitedViews.splice(i, 1);
        break;
      }
    }
  },
  DEL_CACHED_VIEW: (state, route) => {
    const index = state.cachedViews.indexOf(route.name);
    index > -1 && state.cachedViews.splice(index, 1);
  },

  DEL_OTHERS_VISITED_VIEWS: (state, route) => {
    state.visitedViews = state.visitedViews.filter((v) => {
      return v.meta.affix || v.path === route.path;
    });
  },
  DEL_OTHERS_CACHED_VIEWS: (state, route) => {
    const index = state.cachedViews.indexOf(route.name);
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1);
    } else {
      // if index = -1, there is no cached tags
      state.cachedViews = [];
    }
  },

  DEL_ALL_VISITED_VIEWS: (state) => {
    // keep affix tags
    const affixTags = state.visitedViews.filter((tag) => tag.meta.affix);
    state.visitedViews = affixTags;
  },
  DEL_ALL_CACHED_VIEWS: (state) => {
    state.cachedViews = [];
  },

  UPDATE_VISITED_VIEW: (state, route) => {
    for (let v of state.visitedViews) {
      if (v.path === route.path) {
        v = Object.assign(v, route);
        break;
      }
    }
  },
};

const actions = {
  addView({ dispatch }, route) {
    dispatch('addVisitedView', route);
    dispatch('addCachedView', route);
  },
  addVisitedView({ commit }, route) {
    commit('ADD_VISITED_VIEW', route);
  },
  addCachedView({ commit }, route) {
    commit('ADD_CACHED_VIEW', route);
  },

  delView({ dispatch, state }, route) {
    return new Promise((resolve) => {
      dispatch('delVisitedView', route);
      dispatch('delCachedView', route);
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews],
      });
    });
  },
  delVisitedView({ commit, state }, route) {
    return new Promise((resolve) => {
      commit('DEL_VISITED_VIEW', route);
      resolve([...state.visitedViews]);
    });
  },
  delCachedView({ commit, state }, route) {
    return new Promise((resolve) => {
      commit('DEL_CACHED_VIEW', route);
      resolve([...state.cachedViews]);
    });
  },

  delOthersViews({ dispatch, state }, route) {
    return new Promise((resolve) => {
      dispatch('delOthersVisitedViews', route);
      dispatch('delOthersCachedViews', route);
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews],
      });
    });
  },
  delOthersVisitedViews({ commit, state }, route) {
    return new Promise((resolve) => {
      commit('DEL_OTHERS_VISITED_VIEWS', route);
      resolve([...state.visitedViews]);
    });
  },
  delOthersCachedViews({ commit, state }, route) {
    return new Promise((resolve) => {
      commit('DEL_OTHERS_CACHED_VIEWS', route);
      resolve([...state.cachedViews]);
    });
  },

  delAllViews({ dispatch, state }, route) {
    return new Promise((resolve) => {
      dispatch('delAllVisitedViews', route);
      dispatch('delAllCachedViews', route);
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews],
      });
    });
  },
  delAllVisitedViews({ commit, state }) {
    return new Promise((resolve) => {
      commit('DEL_ALL_VISITED_VIEWS');
      resolve([...state.visitedViews]);
    });
  },
  delAllCachedViews({ commit, state }) {
    return new Promise((resolve) => {
      commit('DEL_ALL_CACHED_VIEWS');
      resolve([...state.cachedViews]);
    });
  },

  updateVisitedView({ commit }, route) {
    commit('UPDATE_VISITED_VIEW', route);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
