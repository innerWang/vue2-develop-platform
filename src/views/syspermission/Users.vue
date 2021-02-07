<template>
  <div :class="$style.user">
    <div :class="$style.tree">
      <a-tree
        :tree-data="treeData"
        show-icon
        default-expand-all
        :selected-keys="selectedUpOrg"
        @select="handleSelectTreeNode"
        :replaceFields="{ title: 'orgName', key: 'orgCode' }"
      />
    </div>
    <div :class="$style.listWrapper">
      <section :class="$style.secTitle">机构用户</section>
      <section :class="$style.search">
        <div :class="$style.options">
          <div>
            <label>工号：</label>
            <a-input placeholder="请输入" v-model.trim="userNo" />
          </div>
          <div>
            <label>名称：</label>
            <a-input placeholder="请输入" v-model.trim="userName" />
          </div>
        </div>
        <div :class="$style.btns">
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button @click="handleReset">重置</a-button>
        </div>
      </section>
      <section :class="$style.list">
        <div :class="$style.head">
          <h4>机构列表</h4>
          <div :class="$style.create" @click="handleCreate">
            <a-icon type="plus-circle" theme="filled" />
            <span>新建</span>
          </div>
        </div>
        <a-table
          :columns="columns"
          :data-source="userList"
          :loading="loading"
          rowKey="userCode"
          :pagination="{
            total: totalCount,
            current: page.pagenum,
            pageSize: page.pagesize,
            showSizeChanger: true,
            showQuickJumper: true,
          }"
          @change="handleTableChange"
        >
          <template #action="record">
            <div :class="$style.actionColumn" @click.stop="handleAction($event, record)">
              <template v-if="!(record.userCode === 'root' || userCode === record.userCode)">
                <span data-action="edit">编辑</span>
                <span data-action="delete" :class="$style.danger">删除</span>
                <span v-if="record.userSt === '0'" data-action="changeStatus">启用</span>
                <span v-else :class="$style.danger" data-action="changeStatus">停用</span>
                <span data-action="unlock" v-if="record.userLockFlg === '0'">解锁</span>
                <span data-action="resetPWD">重置密码</span>
                <!-- 先不实现签退 -->
                <!-- <span
                data-action="forceSignOut"
                v-if="record.userFlag === '1'"
                :class="$style.danger"
              >
                强制签退
              </span> -->
              </template>
              <span data-action="detail">查看详情</span>
            </div>
          </template>
        </a-table>
      </section>
    </div>
    <CreateUser :onCreateSuccess="handleReset" />
    <UserDetail />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import CreateUser from '@/components/users/CreateUser';
import UserDetail from '@/components/users/UserDetail';

export default {
  name: 'Users',
  data() {
    return {
      columns: [
        {
          title: '#',
          key: 'seq',
          customRender: (val, row, idx) => {
            return idx + 1 + this.page.pagesize * (this.page.pagenum - 1);
          },
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
          customRender: (val) => this.VALID_STATUS[val],
        },
        // {
        //   title: '登录状态',
        //   key: 'userFlag',
        //   dataIndex: 'userFlag',
        //   customRender: (val) => this.LOGIN_STATUS[val],
        // },
        // {
        //   title: '锁定状态',
        //   key: 'userLockFlg',
        //   dataIndex: 'userLockFlg',
        //   customRender: (val) => this.LOCK_STATUS[val],
        // },
        {
          title: '所属机构',
          key: 'userOrgName',
          dataIndex: 'userOrgName',
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: '20%',
        },
      ],
      userNo: '',
      userName: '',
      selectedUpOrg: ['0'],
      page: {
        pagenum: 1,
        pagesize: 10,
      },
      searchData: {
        userNo: '',
        userName: '',
      },
    };
  },
  computed: {
    ...mapState('users', ['userList', 'totalCount', 'loading']),
    ...mapState('user', ['userCode']),
    ...mapGetters({
      treeData: 'org/treeData',
      VALID_STATUS: 'dic/VALID_STATUS',
      LOGIN_STATUS: 'dic/LOGIN_STATUS',
      LOCK_STATUS: 'dic/LOCK_STATUS',
    }),
  },
  components: { CreateUser, UserDetail },
  methods: {
    resetSearchCondition() {
      this.userNo = '';
      this.userName = '';
      this.searchData = {
        userNo: '',
        userName: '',
      };
    },
    resetPage() {
      this.page = {
        pagesize: 10,
        pagenum: 1,
      };
    },
    resetSelectedUpOrg() {
      this.selectedUpOrg = ['0'];
    },
    handleSelectTreeNode(keys) {
      if (keys.length === 0) {
        return;
      }
      this.selectedUpOrg = keys;
      this.resetSearchCondition();
      this.resetPage();
      this.getUserList();
    },
    // 重置按钮重置所有条件
    handleReset() {
      this.resetSearchCondition();
      this.resetPage();
      this.resetSelectedUpOrg();
      this.getUserList();
    },
    // 点击搜索按钮时需要重置分页
    handleSearch() {
      this.searchData = {
        userNo: this.userNo,
        userName: this.userName,
      };
      this.resetPage();
      this.getUserList();
    },
    handleTableChange(pagination) {
      this.page = {
        pagenum: pagination.current,
        pagesize: pagination.pageSize,
      };
      this.getUserList();
    },
    handleCreate() {
      this.$store.commit('users/SET_FIELD', { field: 'isCreateVisible', value: true });
    },
    handleAction(e, record) {
      const { action } = e.target.dataset;
      const { userCode, userSt, userName } = record;
      switch (action) {
        case 'edit':
          this.$store.dispatch({
            type: 'users/getUserDetail',
            payload: { userCode },
            callback: (data) => {
              this.$store.commit('users/SET_STATE', {
                isCreateVisible: 'edit',
                currUserDetail: data,
              });
            },
          });
          break;
        case 'unlock':
          this.$modal.confirm({
            title: `确认解锁用户【${userName}】吗？`,
            onOk: () => {
              this.$store.dispatch({
                type: 'users/updateUserStatus',
                payload: { userCode, userLockFlg: '1' },
                needUpdate: true, // 添加该标志表示是否需要更新当条记录
              });
            },
          });
          break;
        case 'delete':
          this.$modal.confirm({
            title: `确认删除用户【${userName}】吗？`,
            content: '一经删除无法恢复！',
            onOk: () => {
              this.$store.dispatch({
                type: 'users/deleteUser',
                payload: { userCode },
                // 删除成功则清空筛选条件去拿第一页数据
                callback: this.handleReset,
              });
            },
          });
          break;
        case 'changeStatus':
          this.$modal.confirm({
            title: `是否要将用户【${userName}】的状态设置为【${
              userSt === '0' ? '有效' : '无效'
            }】？`,
            onOk: () => {
              this.$store.dispatch({
                type: 'users/updateUserStatus',
                payload: {
                  userCode,
                  userSt: userSt === '0' ? '1' : '0',
                },
                needUpdate: true,
              });
            },
          });
          break;
        case 'resetPWD':
          this.$modal.confirm({
            title: `是否要重置用户【${userName}】的密码？`,
            onOk: () => {
              this.$store.dispatch({
                type: 'users/updateUserStatus',
                payload: {
                  userCode,
                  userPwd: '123456', // 默认重置密码为 123456
                },
              });
            },
          });
          break;
        case 'detail':
          this.$store.dispatch({
            type: 'users/getUserDetail',
            payload: { userCode },
            callback: (data) => {
              this.$store.commit('users/SET_STATE', {
                isDetailVisible: true,
                currUserDetail: data,
              });
            },
          });
          break;
        default:
          break;
      }
    },
    getUserList() {
      this.$store.dispatch({
        type: 'users/getUserList',
        payload: {
          data: { ...this.searchData, orgCode: this.selectedUpOrg[0] },
          page: this.page,
        },
      });
    },
  },
  mounted() {
    // 机构树为空，去取一下机构树的数据
    if (this.treeData[0].children.length === 0) {
      this.$store.dispatch('org/getOrgTree');
    }
    // 默认去取所有机构下的用户
    this.getUserList();
  },
};
</script>

<style lang="scss" module>
.user {
  display: flex;
  min-height: 100%;

  .tree {
    padding: 0.16rem 0.1rem 0 0.1rem;
    margin-right: 0.24rem;
    flex-shrink: 0;
    min-width: 2rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    background-color: #fff;
  }

  .listWrapper {
    flex-grow: 1;
    > section {
      padding: 0.24rem 0.32rem;
      border-radius: 2px;
      background-color: #fff;
      width: 100%;
      &:not(:last-child) {
        margin-bottom: 0.16rem;
      }
    }

    .secTitle {
      font-size: 0.2rem;
      font-weight: bold;
    }
    .search {
      display: flex;
      justify-content: space-between;

      .options {
        display: flex;

        > div {
          &:not(:last-child) {
            margin-right: 0.16rem;
          }
        }
      }

      .btns {
        button {
          &:not(:last-child) {
            margin-right: 0.1rem;
          }
        }
      }

      input {
        width: 1.8rem;
      }
    }

    .list {
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
          white-space: nowrap;
          margin: 0 0.12rem 0.06rem 0;

          &:last-child {
            margin-right: 0;
          }

          &:hover {
            opacity: 0.85;
          }
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
}
</style>
