<template>
  <div :class="$style.menu">
    <div :class="$style.toolbar">
      <a-button type="primary" @click="handleCreate"><a-icon type="plus" />新建</a-button>
    </div>
    <a-table
      :columns="columns"
      :data-source="menuTree"
      :pagination="false"
      :loading="loading"
      rowKey="menuCode"
    >
      <template #menuIcon="type">
        <span v-if="type"><a-icon :type="type" /> {{ type }}</span>
      </template>
      <template #action="record">
        <div :class="$style.actionColumn" @click.stop="handleActions($event, record)">
          <template v-if="record.menuType !== '3'">
            <span data-action="add">新增</span>
            <a-divider type="vertical" />
          </template>
          <span data-action="edit">编辑</span>
          <a-divider type="vertical" />
          <span data-action="delete" :class="$style.danger">删除</span>
        </div>
      </template>
    </a-table>
    <CreateOrEditMenu :onSuccess="getMenuTree" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import CreateOrEditMenu from '@/components/menu/CreateOrEditMenu';
import { omit } from '@/utils/helpers';
export default {
  name: 'Menu',
  data() {
    return {
      columns: [
        {
          title: '菜单名称',
          key: 'menuName',
          dataIndex: 'menuName',
        },
        {
          title: '图标',
          key: 'menuIcon',
          dataIndex: 'menuIcon',
          scopedSlots: { customRender: 'menuIcon' },
        },
        {
          title: '菜单路径',
          key: 'menuPath',
          dataIndex: 'menuPath',
        },
        {
          title: '权限标识',
          key: 'funcSign',
          dataIndex: 'funcSign',
        },
        {
          title: '菜单类型',
          key: 'menuType',
          dataIndex: 'menuType',
          customRender: (val) => this.MENU_TYPE[val],
        },
        {
          title: '显示顺序',
          key: 'menuSeq',
          dataIndex: 'menuSeq',
        },
        {
          title: '操作',
          key: 'actions',
          scopedSlots: { customRender: 'action' },
        },
      ],
    };
  },
  computed: {
    ...mapState('menu', ['menuTree', 'loading']),
    ...mapGetters('dic', ['MENU_TYPE']),
  },
  components: { CreateOrEditMenu },
  mounted() {
    // 挂载的时候不用去取，因为初次进来拿到用户信息时已经获取一次了
  },
  methods: {
    handleCreate() {
      this.$store.commit('menu/SET_STATE', {
        isCreateVisible: true,
        currMenu: {},
      });
    },
    handleActions(e, record) {
      const { action } = e.target.dataset;
      const { menuName, menuType, menuCode } = record;
      switch (action) {
        case 'add':
          this.$store.commit('menu/SET_STATE', {
            isCreateVisible: true,
            currMenu: { menuUpCode: menuCode, menuUpType: menuType },
          });
          break;
        case 'edit':
          this.$store.commit('menu/SET_STATE', {
            isCreateVisible: 'edit',
            currMenu: omit(record, ['children']),
          });
          break;
        case 'delete':
          this.$modal.confirm({
            title: `确定要删除【 ${this.MENU_TYPE[menuType]}：${menuName} 】吗？`,
            icon: 'exclamation-circle',
            onOk: () => {
              this.$store.dispatch({
                type: 'menu/deleteMenu',
                payload: { menuCode },
                callback: () => {
                  this.getMenuTree();
                },
              });
            },
          });
          break;
        default:
          break;
      }
    },
    getMenuTree() {
      this.$store.dispatch('menu/getMenuTree');
    },
  },
};
</script>

<style lang="scss" module>
@import '@/styles/mixin';
.menu {
  @include whiteBgBox;

  .toolbar {
    margin-bottom: 0.24rem;
  }

  .actionColumn {
    color: $primary-color;

    > span {
      cursor: pointer;
    }

    .danger {
      color: #f5222d;
    }
  }
}
</style>
