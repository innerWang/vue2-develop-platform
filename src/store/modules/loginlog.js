import axios from '@/utils/axios';
import { message } from 'ant-design-vue';

const state = {
  // 用于登录日志列表
  list: [],
  totalCount: 0,
  loading: false,
};

const mutations = {
  SET_STATE: (state, payload) => {
    Object.assign(state, payload);
  },
  SET_FIELD: (state, { field, value }) => {
    if (Object.prototype.hasOwnProperty.call(state, field)) {
      state[field] = value;
    }
  },
};

const actions = {
  getLoginLogList: async ({ commit }, { payload }) => {
    try {
      commit('SET_FIELD', { field: 'loading', value: true });
      const { data, page } = payload;
      const { list, totalcnt } = await axios({
        url: 'getLoginlogList',
        data,
        page,
      });
      commit('SET_STATE', { list: list || [], totalCount: totalcnt || 0 });
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    } finally {
      commit('SET_FIELD', { field: 'loading', value: false });
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
