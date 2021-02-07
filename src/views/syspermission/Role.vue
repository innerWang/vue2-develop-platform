<template>
  <div :class="$style.role">
    <section :class="$style.list">
      <div :class="$style.head">
        <h4>岗位列表</h4>
        <div :class="$style.create" @click="handleCreate">
          <a-icon type="plus-circle" theme="filled" />
          <span>新建</span>
        </div>
      </div>
      <a-table
        :columns="columns"
        :data-source="roleList"
        rowKey="roleCode"
        :loading="loading"
        :pagination="{
          total: totalCount,
          current: page.pagenum,
          pageSize: page.pagesize,
          showSizeChanger: true,
          showQuickJumper: true,
        }"
        @change="handleTableChange"
      >
        <template #roleSt="val">
          <span :class="val === '0' ? $style.invalid : ''">
            {{ VALID_STATUS[val] }}
          </span>
        </template>
        <template #action="record">
          <div :class="$style.actionColumn" @click.stop="handleAction($event, record)">
            <span data-action="edit">岗位功能设置</span>
            <a-divider type="vertical" />
            <span data-action="detail">人员查看</span>
            <a-divider type="vertical" />
            <span v-if="record.roleSt === '0'" data-action="enable">
              启用
            </span>
            <span v-else :class="$style.danger" data-action="disable">
              停用
            </span>
          </div>
        </template>
      </a-table>
    </section>
    <CreateRole :onSuccess="onCreateSuccess" />
    <UsersOfRole :roleInfo="currRole" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import CreateRole from '@/components/role/CreateRole';
import UsersOfRole from '@/components/role/UsersOfRole';
export default {
  name: 'Role',
  data: function() {
    return {
      page: {
        pagesize: 10,
        pagenum: 1,
      },
      columns: [
        {
          title: '#',
          key: 'seq',
          customRender: (val, row, idx) => {
            return idx + 1 + this.page.pagesize * (this.page.pagenum - 1);
          },
        },
        {
          title: '岗位名称',
          key: 'roleName',
          dataIndex: 'roleName',
        },
        {
          title: '有效状态',
          key: 'roleSt',
          dataIndex: 'roleSt',
          scopedSlots: { customRender: 'roleSt' },
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      currRole: {},
    };
  },
  computed: {
    ...mapState('role', ['roleList', 'totalCount', 'loading']),
    ...mapGetters({
      VALID_STATUS: 'dic/VALID_STATUS',
    }),
  },
  components: { CreateRole, UsersOfRole },
  methods: {
    resetPage() {
      this.page = {
        pagenum: 1,
        pagesize: 10,
      };
    },
    handleCreate() {
      this.$store.commit('role/SET_STATE', { currRoleDetail: {}, isCreateVisible: true });
    },
    onCreateSuccess() {
      this.resetPage();
      this.getRoleList();
    },
    handleTableChange(pagination) {
      this.page = {
        pagenum: pagination.current,
        pagesize: pagination.pageSize,
      };
      this.getRoleList();
    },
    handleAction(e, record) {
      const { action } = e.target.dataset;
      const { roleCode } = record;
      switch (action) {
        case 'edit':
          this.$store.dispatch({
            type: 'role/getRoleDetail',
            payload: { roleCode },
            callback: (data) => {
              this.$store.commit('role/SET_STATE', {
                currRoleDetail: data,
                isCreateVisible: 'edit',
              });
            },
          });
          break;
        case 'detail':
          // 查看岗位下的人员列表
          this.$store.commit('role/SET_FIELD', { field: 'isUsersOfRoleVisible', value: true });
          this.currRole = record;
          break;
        case 'enable':
          this.$store.dispatch({
            type: 'role/setRoleStatus',
            payload: { roleSt: '1', roleCode },
          });
          break;
        case 'disable':
          this.$modal.confirm({
            title: '确认停用此岗位吗？',
            onOk: () => {
              this.$store.dispatch({
                type: 'role/setRoleStatus',
                payload: { roleSt: '0', roleCode },
              });
            },
          });
          break;
        default:
          break;
      }
    },
    getRoleList: function() {
      this.$store.dispatch({
        type: 'role/getRoleList',
        payload: {
          page: this.page,
        },
      });
    },
  },
  mounted() {
    this.getRoleList();
  },
};
</script>

<style lang="scss" module>
.role {
  .list {
    padding: 0.24rem 0.32rem;
    border-radius: 2px;
    background-color: #fff;

    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.24rem;

      h4 {
        margin-bottom: 0;
      }

      .create {
        display: flex;
        align-items: center;
        color: $primary-color;
        font-size: 0.14rem;
        cursor: pointer;
        > span {
          margin-left: 6px;
        }
      }
    }

    .actionColumn {
      color: $primary-color;

      > span {
        cursor: pointer;
      }
    }

    .danger {
      color: #f5222d;
    }

    .invalid {
      color: #999;
    }
  }
}
</style>
