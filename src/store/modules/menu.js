import axios from '@/utils/axios';
import { message } from 'ant-design-vue';
import { hasChildren } from '@/utils/helpers';

const state = {
  menuTree: [],
  loading: false,
  isCreateVisible: false,
  isCreateLoading: false,
  currMenu: {},
};

const getters = {
  menuTreeWithRoot: (state) => {
    return addRootForMenu(state.menuTree);
  },
  classifiedMenu: (state) => {
    const { leafs, upMenu } = classifyMenu(state.menuTree);
    return {
      dirs: addRootForMenu(upMenu),
      leafs,
    };
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
};

const actions = {
  getMenuTree: async ({ commit }) => {
    try {
      commit('SET_FIELD', { field: 'loading', value: true });
      const { list } = await axios({
        url: 'getMenuTree',
      });
      commit('SET_STATE', { menuTree: list || [] });
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    } finally {
      commit('SET_FIELD', { field: 'loading', value: false });
    }
  },
  addMenu: async ({ commit }, { payload, callback }) => {
    try {
      commit('SET_FIELD', { field: 'isCreateLoading', value: true });
      const isEdit = !!payload.menuCode;
      await axios({
        url: isEdit ? 'updateMenu' : 'addMenu',
        data: payload,
      });
      message.success(`${isEdit ? '修改' : '新建'}菜单成功！`);
      if (typeof callback === 'function') {
        callback();
      }
    } catch (e) {
      message.error(e.message || JSON.stringify(e));
    } finally {
      commit('SET_FIELD', { field: 'isCreateLoading', value: false });
    }
  },
  deleteMenu: async (_, { payload, callback }) => {
    try {
      await axios({
        url: 'deleteMenu',
        data: payload,
      });
      message.success('删除菜单成功！');
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
  getters,
  mutations,
  actions,
};

export function getMenuWithoutFunc(menu) {
  return menu
    .map((m) => {
      // 若是页面的功能点则直接返回 null
      if (m.menuType !== '3') {
        if (m.children && m.children.length !== 0) {
          let newChildren = getMenuWithoutFunc(m.children);
          if (newChildren.length === 0) {
            newChildren = null;
          }
          // 有更改一定要返回新的对象！！！
          return { ...m, children: newChildren };
        }
        return m;
      }
      return null;
    })
    .filter(Boolean);
}

const FUNC_MENU_TYPE = '3';

/**
 * 将传入的 树形结构 menu 进行分类：
 * 1、包含目录和菜单的树形结构
 * 2、包含所有的叶子节点
 */
function classifyMenu(menu) {
  let leafs = [];
  const processor = (acc, cur) => {
    if (cur.menuType !== FUNC_MENU_TYPE) {
      const tmp = {
        menuCode: cur.menuCode,
        menuName: cur.menuName,
      };
      if (hasChildren(cur)) {
        const newChildren = cur.children.reduce(processor, []);
        if (newChildren.length > 0) {
          tmp.children = newChildren;
        }
      } else {
        leafs.push(cur.menuCode);
      }
      acc.push(tmp);
    } else {
      leafs.push(cur.menuCode);
    }

    return acc;
  };

  const upMenu = menu.reduce(processor, []);
  return { upMenu, leafs };
}

function addRootForMenu(menu) {
  const ROOT_MENU_CODE = '0';
  const children = menu.map((m) =>
    m.menuUpCode === '' ? { ...m, menuUpCode: ROOT_MENU_CODE } : m
  );
  const ret = [
    {
      menuCode: '0',
      menuUpCode: '',
      menuName: '系统功能菜单',
      menuType: '1',
      children,
    },
  ];
  return ret;
}
