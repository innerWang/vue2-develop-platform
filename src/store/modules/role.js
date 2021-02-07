import axios from '@/utils/axios';
import { message } from 'ant-design-vue';

const state = {
  roleList: [],
  totalCount: 0,
  loading: false,
  createLoading: false,
  isCreateVisible: false,
  currRoleDetail: {},
  // 用于查看岗位下的人员列表
  isUsersOfRoleVisible: false,
  usersOfRoleList: [],
  countOfUsersOfRole: 0,
  usersOfRoleTableLoading: false,
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
    state.roleList = state.roleList.map((item) => {
      if (item.roleCode === payload.roleCode) {
        return { ...item, ...payload };
      }
      return item;
    });
  },
};

const actions = {
  getRoleList: async ({ commit }, { payload }) => {
    const { page, data } = payload;
    try {
      commit('SET_FIELD', { field: 'loading', value: true });
      const { list, totalcnt } = await axios({
        url: 'getRoleList',
        page,
        data,
      });
      commit('SET_STATE', { roleList: list || [], totalCount: totalcnt || 0 });
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    } finally {
      commit('SET_FIELD', { field: 'loading', value: false });
    }
  },
  createRole: async ({ commit }, { payload, callback }) => {
    try {
      commit('SET_FIELD', { field: 'createLoading', value: true });
      await axios({
        url: 'addRole',
        data: payload,
      });
      message.success('新建岗位成功');
      typeof callback === 'function' && (await callback());
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    } finally {
      commit('SET_FIELD', { field: 'createLoading', value: false });
    }
  },
  setRoleStatus: async ({ commit }, { payload }) => {
    try {
      await axios({
        url: 'toggleRoleValidStatus',
        data: payload,
      });
      message.success(`${payload.roleSt === '0' ? '停用' : '启用'}岗位成功!`);
      commit('SET_LIST_STATUS', payload);
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    }
  },
  getRoleDetail: async (_, { payload, callback }) => {
    try {
      const data = await axios({
        url: 'getRoleDetail',
        data: payload,
      });
      typeof callback === 'function' && (await callback(data));
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    }
  },
  getUsersOfRole: async ({ commit }, { payload }) => {
    const { data, page } = payload;
    try {
      commit('SET_FIELD', { field: 'usersOfRoleTableLoading', value: true });
      const { list, totalcnt } = await axios({
        url: 'getUserByRole',
        data,
        page,
      });
      commit('SET_STATE', { usersOfRoleList: list || [], countOfUsersOfRole: totalcnt || 0 });
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    } finally {
      commit('SET_FIELD', { field: 'usersOfRoleTableLoading', value: false });
    }
  },
  updateRolePermissions: async ({ commit }, { payload, callback }) => {
    try {
      commit('SET_FIELD', { field: 'editLoading', value: true });
      await axios({
        url: 'updateRolePermissions',
        data: payload,
      });
      message.success('修改岗位成功！');
      commit('SET_LIST_STATUS', { roleCode: payload.roleCode, roleName: payload.roleName });
      if (typeof callback === 'function') {
        callback();
      }
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    } finally {
      commit('SET_FIELD', { field: 'editLoading', value: false });
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
