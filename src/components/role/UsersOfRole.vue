<template>
  <a-modal
    title="岗位人员信息"
    :visible="isUsersOfRoleVisible"
    @cancel="handleCancel"
    :maskClosable="false"
    destroy-on-close
    :wrapClassName="$style.userOfRole"
    :width="600"
  >
    <div :class="$style.contWrapper">
      <div :class="$style.name">
        <span>岗位名称：</span>
        <span>{{ roleInfo.roleName }}</span>
      </div>
      <a-table
        :columns="columns"
        :data-source="usersOfRoleList"
        rowKey="userCode"
        :loading="usersOfRoleTableLoading"
        :pagination="{
          total: countOfUsersOfRole,
          current: page.pagenum,
          pageSize: page.pagesize,
          showSizeChanger: true,
          showQuickJumper: true,
        }"
        @change="handleTableChange"
        :scroll="{ y: 400 }"
        size="middle"
      >
        <template #userSt="val">
          <span :class="val === '0' ? $style.invalid : ''">
            {{ VALID_STATUS[val] }}
          </span>
        </template>
      </a-table>
    </div>
    <template slot="footer">
      <a-button key="ok" type="primary" @click="handleCancel">
        关闭
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { formatTime } from '@/utils/helpers';
export default {
  name: 'UsersOfRole',
  data() {
    return {
      page: {
        pagenum: 1,
        pagesize: 10,
      },
      columns: [
        {
          title: '#',
          key: 'seq',
          customRender: (val, row, idx) => {
            return idx + 1 + this.page.pagesize * (this.page.pagenum - 1);
          },
          width: '15%',
        },
        {
          title: '工号',
          key: 'userNo',
          dataIndex: 'userNo',
        },
        {
          title: '名称',
          key: 'userName',
          dataIndex: 'userName',
        },
        {
          title: '有效状态',
          key: 'userSt',
          dataIndex: 'userSt',
          scopedSlots: { customRender: 'userSt' },
        },
        {
          title: '上次登录时间',
          key: 'lstAccessTm',
          dataIndex: 'lstAccessTm',
          customRender: (val) => formatTime(val),
        },
      ],
    };
  },
  props: {
    roleInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState('role', [
      'isUsersOfRoleVisible',
      'usersOfRoleList',
      'countOfUsersOfRole',
      'usersOfRoleTableLoading',
    ]),
    ...mapGetters({
      VALID_STATUS: 'dic/VALID_STATUS',
    }),
  },
  methods: {
    handleCancel() {
      this.$store.commit('role/SET_FIELD', { field: 'isUsersOfRoleVisible', value: false });
    },
    handleTableChange(pagination) {
      this.page = {
        pagenum: pagination.current,
        pagesize: pagination.pageSize,
      };
      this.getUsersOfRole();
    },
    getUsersOfRole() {
      this.$store.dispatch({
        type: 'role/getUsersOfRole',
        payload: {
          page: this.page,
          data: { roleCode: this.roleInfo.roleCode },
        },
      });
    },
    resetData() {
      this.page = {
        pagenum: 1,
        pagesize: 10,
      };
    },
  },
  watch: {
    isUsersOfRoleVisible(val, oldVal) {
      if (val === true && oldVal === false) {
        this.getUsersOfRole();
      }
      if (val === false && oldVal === true) {
        this.resetData();
      }
    },
  },
};
</script>

<style lang="scss" module>
.userOfRole {
  .contWrapper {
    background-color: #fff;
  }
  .name {
    font-size: 0.18rem;
    padding-bottom: 0.16rem;
  }
  :global {
    .ant-table-thead > tr > th {
      padding: 0.08rem 0.04rem;
      color: #666;
    }

    .ant-table-tbody > tr > td {
      padding: 0.08rem 0.04rem;
      color: #333;
      font-size: 0.12rem;
    }
  }
}
</style>
