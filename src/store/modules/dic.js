import axios from '@/utils/axios';
import { message } from 'ant-design-vue';
import { formatDicToArray } from '@/utils/helpers';

const state = {
  dicLUT: {},
  dicList: [],
  totalCount: 0,
  loading: false,
  // 创建字典分组
  isCreateDicGroupVisible: false,
  isCreateDicGroupLoading: false,
  // 创建和修改字典数据
  isCreateDicDataVisible: false,
  isCreateDicDataLoading: false,
  // 存储单条字典数据，新建时存分组的编号和名称，修改时存分组和单条数据信息
  currDicData: {},
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
  // 用于更新本地的字典分组名称或字典数据的对应内容
  UPDATE_DIC_DATA: (state, payload) => {
    const { dicTypeCode, dicData } = payload;
    state.dicList = state.dicList.map((group) => {
      if (group.dicTypeCode === dicTypeCode) {
        const newDicData = group.dicData.map((data) => {
          if (data.dicId === dicData.dicId) {
            return { ...data, ...dicData };
          }
          return data;
        });
        return { ...group, dicData: newDicData };
      }
      return group;
    });
  },
  // 用于删除本地字典数据
  DELETE_DIC_DATA: (state, payload) => {
    const { dicTypeCode, dicId } = payload;
    state.dicList = state.dicList.map((group) => {
      if (group.dicTypeCode === dicTypeCode) {
        const newDicData = group.dicData.filter((data) => data.dicId !== dicId);
        return { ...group, dicData: newDicData };
      }
      return group;
    });
  },
};

const getters = {
  // 有效状态
  VALID_STATUS: (state) => state.dicLUT.D102 || {},
  // 机构级别
  ORG_LEVEL: (state) => state.dicLUT.D105 || {},
  ORG_LEVEL_OPTIONS: (state) => formatDicToArray(state.dicLUT.D105),
  // 用户账户登录状态
  LOGIN_STATUS: (state) => state.dicLUT.D37 || {},
  // 用户账户锁定状态
  LOCK_STATUS: (state) => state.dicLUT.D115 || {},
  // 用户登录结果： 成功 / 失败
  LOGIN_RESULT: (state) => state.dicLUT.D116 || {},
  // 菜单类型
  MENU_TYPE: (state) => state.dicLUT.D103 || {},
};

const actions = {
  getDicLUT: async ({ commit }) => {
    try {
      const { dic } = await axios({
        url: 'getDicLUT',
      });
      await commit('SET_FIELD', { field: 'dicLUT', value: dic || {} });
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    }
  },
  getDicList: async ({ commit }, { payload }) => {
    try {
      commit('SET_FIELD', { field: 'loading', value: true });
      const { data, page } = payload;
      const { list, totalcnt } = await axios({
        url: 'getDicList',
        data,
        page,
      });
      commit('SET_STATE', { dicList: list || [], totalCount: totalcnt || 0 });
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    } finally {
      commit('SET_FIELD', { field: 'loading', value: false });
    }
  },
  // 创建字典分组和创建字典数据都是调用此接口， isData 为 true 时代表是新增数据
  createDicGroup: async ({ commit }, { payload, callback, isData }) => {
    try {
      commit('SET_FIELD', {
        field: isData ? 'isCreateDicDataLoading' : 'isCreateDicGroupLoading',
        value: true,
      });
      await axios({
        url: 'addDic',
        data: payload,
      });
      message.success('创建成功！');
      if (typeof callback === 'function') {
        callback();
      }
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    } finally {
      commit('SET_FIELD', {
        field: isData ? 'isCreateDicDataLoading' : 'isCreateDicGroupLoading',
        value: false,
      });
    }
  },
  // 删除分组与删除具体某条数据使用同一个接口，只传一个参数，另一个为null
  deleteDic: async (_, { payload, callback }) => {
    try {
      await axios({
        url: 'deleteDic',
        data: payload,
      });
      message.success('删除成功！');
      if (typeof callback === 'function') {
        callback();
      }
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    }
  },
  // 修改字典数据
  editDicData: async (_, { payload, callback }) => {
    try {
      await axios({
        url: 'updateDic',
        data: payload,
      });
      message.success('修改成功！');
      if (typeof callback === 'function') {
        callback(payload);
      }
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
