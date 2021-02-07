<template>
  <div :class="$style.sysparams">
    <section :class="$style.toolbar">
      <div :class="$style['toolbar-searchGroups']">
        <div>
          <label>参数名称</label>
          <a-input v-model.trim="parmCode" placeholder="请输入" />
        </div>
      </div>
      <div :class="$style['toolbar-btns']">
        <a-button type="primary" @click="handleSearch">查询</a-button>
        <a-button @click="handleReset">重置</a-button>
      </div>
    </section>
    <section :class="$style.content">
      <div :class="$style.head">
        <h4>系统参数列表</h4>
        <div>
          <!-- <span>CSV导出</span>
          <span>XML导出</span> -->
        </div>
      </div>
      <a-table
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
        row-key="parmCode"
        @change="handleTableChange"
      >
        <template #parmDesc="val">
          <div :class="$style.longText">
            {{ val }}
          </div>
        </template>
        <template #action="record">
          <div :class="$style.actionColumn" @click.stop="handleAction($event, record)">
            <a-button name="detail" type="primary">查看详情</a-button>
            <a-divider type="vertical" />
            <a-button name="edit" type="primary">编辑</a-button>
          </div>
        </template>
      </a-table>
    </section>
    <EditParam />
    <ParamDetail />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditParam from '@/components/param/EditParam';
import ParamDetail from '@/components/param/ParamDetail';
export default {
  name: 'Param',
  data() {
    return {
      page: {
        pagenum: 1,
        pagesize: 10,
      },
      parmCode: '',
      searchData: {
        parmCode: '',
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
          title: '参数名称',
          key: 'parmCode',
          dataIndex: 'parmCode',
        },
        {
          title: '参数值',
          key: 'parmValue',
          dataIndex: 'parmValue',
        },
        {
          title: '参数描述',
          key: 'parmDesc',
          dataIndex: 'parmDesc',
          scopedSlots: { customRender: 'parmDesc' },
          width: '50%',
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
    };
  },
  computed: {
    ...mapState('param', ['list', 'loading', 'totalCount']),
  },
  components: { EditParam, ParamDetail },
  methods: {
    resetPage() {
      this.page = {
        pagenum: 1,
        pagesize: 10,
      };
    },
    resetSearchData() {
      this.searchData = {
        parmCode: '',
      };
      this.parmCode = '';
    },
    handleSearch() {
      this.searchData = {
        parmCode: this.parmCode,
      };
      this.resetPage();
      this.getParamList();
    },
    handleReset() {
      this.resetSearchData();
      this.resetPage();
      this.getParamList();
    },
    handleTableChange(pagination) {
      this.page = {
        pagenum: pagination.current,
        pagesize: pagination.pageSize,
      };
      this.getParamList();
    },
    handleAction(event, record) {
      const { name } = event.target;
      switch (name) {
        case 'detail':
          this.$store.commit('param/SET_STATE', { isDetailVisible: true, currParam: record });
          break;
        case 'edit':
          this.$store.commit('param/SET_STATE', { isEditVisible: true, currParam: record });
          break;
        default:
          break;
      }
    },
    getParamList() {
      this.$store.dispatch({
        type: 'param/getParamList',
        payload: {
          data: this.searchData,
          page: this.page,
        },
      });
    },
  },
  mounted() {
    this.getParamList();
  },
};
</script>

<style lang="scss" module>
.sysparams {
  section {
    padding: 0.24rem 0.32rem;
    border-radius: 2px;
    background-color: #fff;
    width: 100%;
    &:not(:last-child) {
      margin-bottom: 0.16rem;
    }
  }

  .toolbar {
    display: flex;
    justify-content: space-between;

    &-searchGroups {
      display: flex;

      > div {
        display: flex;
        align-items: center;
        label {
          flex-shrink: 0;
          &::after {
            content: '：';
          }
        }
      }
    }

    &-btns {
      flex-shrink: 0;
      margin-left: 0.24rem;
      button {
        &:not(:last-child) {
          margin-right: 0.12rem;
        }
      }
    }
  }

  .content {
    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.16rem;
    }

    .longText {
      white-space: normal;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
}
</style>
