<template>
  <div :class="$style.org">
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
      <section :class="$style.secTitle">下级机构</section>
      <section :class="$style.toolbar">
        <div :class="$style['toolbar-searchGroups']">
          <div>
            <label>机构代码</label>
            <a-input placeholder="请输入" v-model.trim="orgNo" />
          </div>
          <div>
            <label>机构名称</label>
            <a-input placeholder="请输入" v-model.trim="orgName" />
          </div>
        </div>
        <div :class="$style['toolbar-btns']">
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
          :data-source="org.list"
          :loading="org.loading"
          :pagination="{
            total: org.totalCount,
            current: page.pagenum,
            pageSize: page.pagesize,
            showSizeChanger: true,
            showQuickJumper: true,
          }"
          @change="handleTableChange"
        >
          <template #orgSt="val">
            <span :class="val === '0' ? $style.invalid : ''">{{ VALID_STATUS[val] }}</span>
          </template>
          <template #action="record">
            <div :class="$style.actionColumn" @click.stop="handleAction($event, record)">
              <span data-action="edit">编辑</span>
              <a-divider type="vertical" />
              <span data-action="detail">详情</span>
              <!-- 先用上级机构为'0'来判断是否是总行，总行不可停用 -->
              <template v-if="record.orgUpCode !== '0'">
                <a-divider type="vertical" />
                <span v-if="record.orgSt === '0'" data-action="enable">启用</span>
                <span v-else :class="$style.danger" data-action="disable">停用</span>
              </template>
            </div>
          </template>
        </a-table>
      </section>
    </div>
    <CreateOrgModal :orgTree="treeData" :onSuccess="handleReset" />
    <UpdateOrgModal :orgTree="treeData" />
    <OrgDetailModal />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import CreateOrgModal from '@/components/org/CreateOrgModal';
import UpdateOrgModal from '@/components/org/UpdateOrgModal';
import OrgDetailModal from '@/components/org/OrgDetailModal';
export default {
  name: 'Org',
  data: function() {
    return {
      page: {
        pagesize: 10,
        pagenum: 1,
      },
      orgNo: '',
      orgName: '',
      columns: [
        {
          title: '#',
          key: 'seq',
          customRender: (val, row, idx) => {
            return idx + 1 + this.page.pagesize * (this.page.pagenum - 1);
          },
        },
        {
          title: '机构代码',
          key: 'orgNo',
          dataIndex: 'orgNo',
        },
        {
          title: '机构名称',
          key: 'orgName',
          dataIndex: 'orgName',
        },
        {
          title: '机构级别',
          key: 'orgLvl',
          dataIndex: 'orgLvl',
          customRender: (val) => {
            return this.ORG_LEVEL[val];
          },
        },
        {
          title: '有效状态',
          key: 'orgSt',
          dataIndex: 'orgSt',
          scopedSlots: { customRender: 'orgSt' },
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      selectedUpOrg: ['0'], // '0' 代表顶级机构树
      searchData: {
        orgNo: '',
        orgName: '',
      },
    };
  },
  computed: {
    ...mapState({
      org: function(state) {
        const { org } = state;
        return {
          // 使用内部机构号作为key
          list: org.orgList.map((item) => ({ ...item, key: item.orgCode })),
          totalCount: org.totalCount,
          loading: org.loading,
        };
      },
    }),
    ...mapGetters({
      VALID_STATUS: 'dic/VALID_STATUS',
      ORG_LEVEL: 'dic/ORG_LEVEL',
      treeData: 'org/treeData',
    }),
  },
  components: { CreateOrgModal, UpdateOrgModal, OrgDetailModal },
  mounted() {
    this.$store.dispatch('org/getOrgTree');
    this.getOrgList();
  },
  methods: {
    resetSearchCondition() {
      this.orgNo = '';
      this.orgName = '';
      this.searchData = {
        orgNo: '',
        orgName: '',
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
    // 切换选中的树节点
    handleSelectTreeNode(keys) {
      if (keys.length === 0) {
        return;
      }
      this.selectedUpOrg = keys;
      this.resetSearchCondition();
      this.resetPage();
      this.getOrgList();
    },
    // 点击查询按钮
    handleSearch: function() {
      this.searchData = {
        orgNo: this.orgNo,
        orgName: this.orgName,
      };
      this.resetPage();
      this.getOrgList();
    },
    // 点击重置按钮
    handleReset: function() {
      this.resetSearchCondition();
      this.resetPage();
      this.resetSelectedUpOrg();
      this.getOrgList();
    },
    // 改变分页
    handleTableChange: function(pagination) {
      this.page = {
        pagenum: pagination.current,
        pagesize: pagination.pageSize,
      };
      this.getOrgList();
    },
    getOrgList: function() {
      this.$store.dispatch({
        type: 'org/getOrgList',
        payload: {
          data: { ...this.searchData, orgUpCode: this.selectedUpOrg[0] },
          page: this.page,
        },
      });
    },
    handleCreate: function() {
      this.$store.commit('org/SET_FIELD', { field: 'isCreateVisible', value: true });
    },
    handleAction: function(e, record) {
      const { action } = e.target.dataset;
      const { orgCode } = record;
      switch (action) {
        case 'edit':
          this.$store.dispatch({
            type: 'org/getOrgDetail',
            payload: { orgCode },
            callback: (data) => {
              this.$store.commit('org/SET_STATE', { isEditVisible: true, currOrg: data });
            },
          });
          break;
        case 'detail':
          this.$store.dispatch({
            type: 'org/getOrgDetail',
            payload: { orgCode },
            callback: (data) => {
              this.$store.commit('org/SET_STATE', { isDetailVisible: true, currOrg: data });
            },
          });
          break;
        case 'enable':
          this.$store.dispatch({
            type: 'org/setOrgStatus',
            payload: { orgSt: '1', orgCode },
          });
          break;
        case 'disable':
          this.$modal.confirm({
            title: '确认停用此机构吗？',
            content: '停用后，该机构下属用户账户都会无效！',
            onOk: () => {
              // 这里不需要重置选中的上级机构，因为一定是停用下级机构！
              this.$store.dispatch({
                type: 'org/setOrgStatus',
                payload: { orgSt: '0', orgCode },
              });
            },
          });
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" module>
@import '@/styles/mixin';
.org {
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
    .toolbar {
      @include searchToolbar;
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
