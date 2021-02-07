import axios from '@/utils/axios';
import { message } from 'ant-design-vue';

const state = {
  orgList: [],
  totalCount: 0,
  loading: false,
  orgTree: [],
  createLoading: false,
  isCreateVisible: false,
  editLoading: false,
  isEditVisible: false,
  isDetailVisible: false,
  currOrg: {},
};

const getters = {
  // 带有顶层机构树的树形拓扑数据
  treeData: (state) => {
    const ROOT_ORG_CODE = '0';
    const children = state.orgTree.map((org) =>
      org.orgUpCode === '' ? { ...org, orgUpCode: ROOT_ORG_CODE } : org
    );
    const ret = [
      {
        orgCode: '0',
        orgName: '机构树',
        orgUpCode: '',
        children,
      },
    ];
    return ret;
  },
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
    state.orgList = state.orgList.map((org) => {
      if (org.orgCode === payload.orgCode) {
        return { ...org, ...payload };
      }
      return org;
    });
  },
};

const actions = {
  // 获取机构树
  getOrgTree: async ({ commit }) => {
    try {
      const { list } = await axios({
        url: 'getOrgTree',
        data: {
          orgUpCode: '0', // 代表是查询整个机构树
        },
      });
      commit('SET_FIELD', { field: 'orgTree', value: list || [] });
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    }
  },
  // 获取机构列表
  getOrgList: async ({ commit }, { payload }) => {
    const { data, page } = payload;
    try {
      commit('SET_FIELD', { field: 'loading', value: true });
      const { list, totalcnt } = await axios({
        url: 'getOrgListByLevel',
        data,
        page,
      });
      commit('SET_STATE', { orgList: list || [], totalCount: totalcnt || 0 });
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    } finally {
      commit('SET_FIELD', { field: 'loading', value: false });
    }
  },
  // 获取所有机构，目前用于用户管理界面创建用户选择机构，也用于用户登录日志筛选
  getAllOrg: async (_, { payload, callback }) => {
    try {
      const { list } = await axios({
        url: 'getAllOrg',
        data: payload,
      });
      if (typeof callback === 'function') {
        const l = (list || []).map((t) => ({ orgCode: t.orgCode, orgName: t.orgName }));
        callback(l);
      }
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    }
  },
  // 创建机构
  createOrg: async ({ commit, dispatch }, { payload, callback }) => {
    try {
      commit('SET_FIELD', { field: 'createLoading', value: true });
      await axios({
        url: 'addOrg',
        data: payload,
      });
      message.success('新建机构成功！');
      dispatch('getOrgTree');
      typeof callback === 'function' && (await callback());
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    } finally {
      commit('SET_FIELD', { field: 'createLoading', value: false });
    }
  },
  // 修改机构信息
  updateOrg: async ({ commit, dispatch }, { payload, callback }) => {
    try {
      commit('SET_FIELD', { field: 'editLoading', value: true });
      await axios({
        url: 'updateOrgDetail',
        data: payload,
      });
      message.success('修改机构信息成功！');
      commit('SET_LIST_STATUS', payload);
      dispatch('getOrgTree');
      typeof callback === 'function' && (await callback());
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    } finally {
      commit('SET_FIELD', { field: 'editLoading', value: false });
    }
  },
  // 设置机构状态
  setOrgStatus: async ({ commit }, { payload, callback }) => {
    try {
      await axios({
        url: 'toggleOrgValidStatus',
        data: payload,
      });
      message.success(`${payload.orgSt === '0' ? '停用' : '启用'}机构成功!`);
      commit('SET_LIST_STATUS', payload);
      // 由于机构树会显示所有状态的机构，所以不需要去查
      // await dispatch('getOrgTree');
      typeof callback === 'function' && (await callback());
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    }
  },
  // 获取机构详情
  getOrgDetail: async (_, { payload, callback }) => {
    try {
      const resp = await axios({
        url: 'getOrgDetail',
        data: payload,
      });
      typeof callback === 'function' && (await callback(resp));
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
