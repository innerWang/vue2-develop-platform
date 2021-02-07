<template>
  <div :class="$style.syslog">
    <section :class="$style.toolbar">
      <div :class="$style['toolbar-searchGroups']">
        <div>
          <label>操作日期</label>
          <a-range-picker show-time v-model="dates" />
        </div>
        <div>
          <label>用户名称</label>
          <a-input v-model="txnerName" placeholder="请输入用户名称" allow-clear />
        </div>
      </div>
      <div :class="$style['toolbar-btns']">
        <a-button type="primary" @click="handleSearch">查询</a-button>
        <a-button @click="handleReset">重置</a-button>
      </div>
    </section>
    <section :class="$style.content">
      <h4>系统日志列表</h4>
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
      ></a-table>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { formatTime } from '@/utils/helpers';
export default {
  name: 'SystemLog',
  data() {
    return {
      dates: [],
      txnerName: '',
      searchData: {
        txnStartDate: '',
        txnEndDate: '',
        txnerName: '',
      },
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
          title: '用户名称',
          key: 'userName',
          dataIndex: 'userName',
        },
        {
          title: '开始时间',
          key: 'txnStartTm',
          dataIndex: 'txnStartTm',
          customRender: (val) => formatTime(val),
        },
        {
          title: '结束时间',
          key: 'txnEndTm',
          dataIndex: 'txnEndTm',
          customRender: (val) => formatTime(val),
        },
        {
          title: '映射交易地址',
          key: 'mpTxn',
          dataIndex: 'mpTxn',
        },
        {
          title: '详情',
          key: 'txnLog',
          dataIndex: 'txnLog',
        },
      ],
    };
  },
  computed: {
    ...mapState('syslog', ['list', 'totalCount', 'loading']),
  },
  methods: {
    resetPage() {
      this.page = {
        pagesize: 10,
        pagenum: 1,
      };
    },
    resetSearch() {
      this.dates = [];
      this.txnerName = '';
      this.searchData = { txnStartDate: '', txnEndDate: '', txnerName: '' };
    },
    handleSearch() {
      const tmpDates = this.dates
        .map((k) => k && Math.round(Date.parse(k) / 1000).toString())
        .filter(Boolean);
      this.searchData = {
        txnStartDate: tmpDates.length !== 2 ? '' : tmpDates[0],
        txnEndDate: tmpDates.length !== 2 ? '' : tmpDates[1],
        txnerName: this.txnerName,
      };
      this.resetPage();
      this.getSyslogList();
    },
    handleReset() {
      this.resetPage();
      this.resetSearch();
      this.getSyslogList();
    },
    handleTableChange(pagination) {
      this.page = {
        pagenum: pagination.current,
        pagesize: pagination.pageSize,
      };
      this.getSyslogList();
    },
    getSyslogList() {
      this.$store.dispatch({
        type: 'syslog/getLogList',
        payload: {
          page: this.page,
          data: this.searchData,
        },
      });
    },
  },
  mounted() {
    this.getSyslogList();
  },
};
</script>

<style lang="scss" module>
@import '@/styles/mixin';
.syslog {
  > section {
    @include whiteBgBox;
    &:not(:last-child) {
      margin-bottom: 0.16rem;
    }
  }

  .toolbar {
    @include searchToolbar;
  }

  .content {
    h4 {
      margin-bottom: 0.24rem;
    }
  }
}
</style>
