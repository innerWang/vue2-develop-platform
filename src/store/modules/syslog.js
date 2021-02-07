import axios from '@/utils/axios';
import { message } from 'ant-design-vue';

const state = {
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
  getLogList: async ({ commit }, { payload }) => {
    try {
      commit('SET_FIELD', { field: 'loading', value: true });
      const { page, data } = payload;
      const { list, totalcnt } = await axios({
        url: 'getSyslogList',
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
