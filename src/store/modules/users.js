// 用户管理
import axios from '@/utils/axios';
import { message } from 'ant-design-vue';
const state = {
  userList: [],
  totalCount: 0,
  loading: false,
  // 用于创建和修改用户
  isCreateVisible: false,
  isCreateLoading: false,
  currUserDetail: {},
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
  // 修改某条记录的信息，用于修改状态
  SET_LIST_STATUS: (state, payload) => {
    state.userList = state.userList.map((item) => {
      if (item.userCode === payload.userCode) {
        return { ...item, ...payload };
      }
      return item;
    });
  },
};

const actions = {
  getUserList: async ({ commit }, { payload }) => {
    const { data, page } = payload;
    try {
      commit('SET_FIELD', { field: 'loading', value: true });
      const { list, totalcnt } = await axios({
        url: 'getUserList',
        data,
        page,
      });
      commit('SET_STATE', { userList: list || [], totalCount: totalcnt || 0 });
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    } finally {
      commit('SET_FIELD', { field: 'loading', value: false });
    }
  },
  deleteUser: async (_, { payload, callback }) => {
    try {
      await axios({
        url: 'deleteUser',
        data: payload,
      });
      message.success('删除成功！');
      if (typeof callback === 'function') {
        await callback();
      }
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    }
  },
  // 修改用户状态，含有效性、重置密码、解锁
  updateUserStatus: async ({ commit }, { payload, needUpdate }) => {
    try {
      await axios({
        url: 'updateUserStatus',
        data: payload,
      });
      message.success('修改用户状态成功！');
      if (needUpdate) {
        commit('SET_LIST_STATUS', payload);
      }
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    }
  },
  updateUserDetail: async ({ commit }, { payload, callback }) => {
    try {
      commit('SET_FIELD', { field: 'isCreateLoading', value: true });
      await axios({
        url: 'updateUserDetail',
        data: payload,
      });
      message.success('修改用户信息成功！');
      commit('SET_LIST_STATUS', payload);
      if (typeof callback === 'function') {
        callback();
      }
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    } finally {
      commit('SET_FIELD', { field: 'isCreateLoading', value: false });
    }
  },
  getUserDetail: async (_, { payload, callback }) => {
    try {
      const data = await axios({
        url: 'getUserDetail',
        data: payload,
      });
      if (typeof callback === 'function') {
        callback(data);
      }
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    }
  },
  createUser: async ({ commit }, { payload, callback }) => {
    try {
      commit('SET_FIELD', { field: 'isCreateLoading', value: true });
      await axios({
        url: 'addUser',
        data: payload,
      });
      message.success('新建用户成功！');
      if (typeof callback === 'function') {
        callback();
      }
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    } finally {
      commit('SET_FIELD', { field: 'isCreateLoading', value: false });
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
