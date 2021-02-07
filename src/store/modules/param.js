import axios from '@/utils/axios';
import { message } from 'ant-design-vue';

const state = {
  list: [],
  totalCount: 0,
  loading: false,
  // 修改参数
  isEditVisible: false,
  isEditLoading: false,
  currParam: {},
  isDetailVisible: false,
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
  UPDATE_LIST: (state, payload) => {
    state.list = state.list.map((l) => {
      if (l.parmCode === payload.parmCode) {
        return { ...l, ...payload };
      }
      return l;
    });
  },
};

const actions = {
  getParamList: async ({ commit }, { payload }) => {
    try {
      commit('SET_FIELD', { field: 'loading', value: true });
      const { data, page } = payload;
      const { list, totalcnt } = await axios({
        url: 'getParamList',
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
  updateParam: async ({ commit }, { payload, callback }) => {
    try {
      await axios({
        url: 'updateParam',
        data: payload,
      });
      message.success('修改系统参数成功！');
      commit('UPDATE_LIST', payload);
      if (typeof callback === 'function') {
        callback();
      }
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
