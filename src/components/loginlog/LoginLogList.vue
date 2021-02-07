<template>
  <div :class="$style.loglist">
    <section :class="$style.toolbar">
      <div :class="$style['toolbar-searchGroups']">
        <div>
          <label>员工号</label>
          <a-input v-model="userNo" />
        </div>
        <div>
          <label>所属机构</label>
          <a-select v-model="orgCode" allow-clear>
            <a-select-option v-for="org in orgs" :key="org.orgCode" :value="org.orgCode">
              {{ org.orgName }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div :class="$style['toolbar-btns']">
        <a-button type="primary" @click="handleSearch">查询</a-button>
        <a-button @click="handleReset">重置</a-button>
      </div>
    </section>
    <section :class="$style.content">
      <a-table
        rowKey="logId"
        :columns="columns"
        :data-source="list"
        :loading="loading"
        :pagination="{
          total: totalCount,
          current: page.pagenum,
          pageSize: page.pagesize,
          showSizeChanger: true,
          showQuickJumper: true,
        }"
        @change="handleTableChange"
      />
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { formatTime } from '@/utils/helpers';
export default {
  name: 'LoginLogList',
  data() {
    return {
      userNo: '',
      orgCode: '',
      searchData: {},
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
          title: '员工号',
          key: 'userNo',
          dataIndex: 'userNo',
        },
        {
          title: '所属机构',
          key: 'orgName',
          dataIndex: 'orgName',
        },
        {
          title: '登录时间',
          key: 'loginTm',
          dataIndex: 'loginTm',
          customRender: (val) => formatTime(val),
        },
        {
          title: '退出时间',
          key: 'logoutTm',
          dataIndex: 'logoutTm',
          customRender: (val) => formatTime(val),
        },
        {
          title: '登录结果',
          key: 'loginRst',
          dataIndex: 'loginRst',
          customRender: (val) => this.LOGIN_RESULT[val],
        },
        {
          title: '登录IP',
          key: 'loginAddr',
          dataIndex: 'loginAddr',
        },
        {
          title: '详情描述',
          key: 'loginRmk',
          dataIndex: 'loginRmk',
        },
      ],
    };
  },
  props: {
    orgs: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState('loginlog', ['list', 'loading', 'totalCount']),
    ...mapGetters('dic', ['LOGIN_RESULT']),
  },
  methods: {
    resetSearchData() {
      this.userNo = '';
      this.orgCode = '';
      this.searchData = {};
    },
    resetPage() {
      this.page = {
        pagesize: 10,
        pagenum: 1,
      };
    },
    handleTableChange(pagination) {
      this.page = {
        pagenum: pagination.current,
        pagesize: pagination.pageSize,
      };
      this.getLoginLogList();
    },
    handleSearch() {
      this.searchData = {
        userNo: this.userNo,
        orgCode: this.orgCode,
      };
      this.resetPage();
      this.getLoginLogList();
    },
    handleReset() {
      this.resetPage();
      this.resetSearchData();
      this.getLoginLogList();
    },
    getLoginLogList() {
      this.$store.dispatch({
        type: 'loginlog/getLoginLogList',
        payload: {
          data: this.searchData,
          page: this.page,
        },
      });
    },
  },
  mounted() {
    this.getLoginLogList();
  },
};
</script>

<style lang="scss" module>
@import '@/styles/mixin';
.loglist {
  .toolbar {
    @include searchToolbar;
    margin-bottom: 0.24rem;
  }
}
</style>
