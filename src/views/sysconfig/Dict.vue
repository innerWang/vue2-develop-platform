<template>
  <div :class="$style.dic">
    <section :class="$style.toolbar">
      <div :class="$style.searchBox">
        <div :class="$style.searchBoxFilters">
          <div>
            <label>字典类型编号</label>
            <a-input placeholder="请输入" v-model.trim="dicTypeCode" />
          </div>
          <div>
            <label>字典类型名称</label>
            <a-input placeholder="请输入" v-model.trim="dicTypeName" />
          </div>
        </div>
        <div :class="$style.searchBoxBtns">
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button @click="handleReset">重置</a-button>
        </div>
      </div>
      <div :class="$style.extra">
        <a-button type="primary" @click="handleCreate">新建字典类型</a-button>
      </div>
    </section>
    <section :class="$style.content">
      <h4>字典列表</h4>
      <a-table
        :columns="columns"
        :data-source="dicList"
        :loading="loading"
        :pagination="{
          total: totalCount,
          current: page.pagenum,
          pageSize: page.pagesize,
          showSizeChanger: true,
          showQuickJumper: true,
        }"
        row-key="dicTypeCode"
        @change="handleTableChange"
      >
        <template #action="record">
          <div :class="$style.actionColumn" @click.stop="handleAction($event, record)">
            <span data-action="delete" :class="$style.danger">删除</span>
          </div>
        </template>
        <template #expandedRowRender="record">
          <div :class="$style.expandContent">
            <div>
              <a-button type="primary" @click="handleAddDicData(record)">
                + 新增字典数据
              </a-button>
            </div>
            <a-table
              :columns="innerColumns"
              :data-source="record.dicData"
              :pagination="false"
              row-key="dicId"
              size="small"
            >
              <template #action="innerRecord">
                <div
                  :class="$style.actionColumn"
                  @click.stop="handleInnerAction($event, innerRecord, record)"
                >
                  <span data-action="edit">编辑</span>
                  <a-divider type="vertical" />
                  <span data-action="delete" :class="$style.danger">删除</span>
                </div>
              </template>
            </a-table>
          </div>
        </template>
      </a-table>
    </section>
    <CreateDicGroup :onCreateSuccess="handleReset" />
    <CreateAndEditDicData :onCreateDicDataSuccess="handleReset" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CreateDicGroup from '@/components/dic/CreateDicGroup';
import CreateAndEditDicData from '@/components/dic/CreateAndEditDicData';
export default {
  name: 'Dict',
  data() {
    return {
      dicTypeCode: '',
      dicTypeName: '',
      searchData: {
        dicTypeCode: '',
        dicTypeName: '',
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
          title: '字典类型编号',
          key: 'dicTypeCode',
          dataIndex: 'dicTypeCode',
        },
        {
          title: '字典类型名称',
          key: 'dicTypeName',
          dataIndex: 'dicTypeName',
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      innerColumns: [
        {
          title: '字典码',
          key: 'dicCode',
          dataIndex: 'dicCode',
        },
        {
          title: '字典名称',
          key: 'dicName',
          dataIndex: 'dicName',
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
    ...mapState('dic', ['dicList', 'totalCount', 'loading']),
  },
  components: { CreateDicGroup, CreateAndEditDicData },
  methods: {
    resetPage() {
      this.page = {
        pagesize: 10,
        pagenum: 1,
      };
    },
    resetSearchData() {
      this.dicTypeCode = '';
      this.dicTypeName = '';
      this.searchData = {
        dicTypeCode: '',
        dicTypeName: '',
      };
    },
    handleTableChange(pagination) {
      this.page = {
        pagenum: pagination.current,
        pagesize: pagination.pageSize,
      };
      this.getDicList();
    },
    handleSearch() {
      this.searchData = {
        dicTypeCode: this.dicTypeCode,
        dicTypeName: this.dicTypeName,
      };
      this.resetPage();
      this.getDicList();
    },
    handleReset() {
      this.resetSearchData();
      this.resetPage();
      this.getDicList();
    },
    handleCreate() {
      this.$store.commit('dic/SET_FIELD', { field: 'isCreateDicGroupVisible', value: true });
    },
    handleAddDicData(record) {
      this.$store.commit('dic/SET_STATE', {
        isCreateDicDataVisible: true,
        currDicData: {
          dicTypeCode: record.dicTypeCode,
          dicTypeName: record.dicTypeName,
        },
      });
    },
    handleAction(event, record) {
      const { action } = event.target.dataset;
      const { dicTypeName, dicTypeCode } = record;
      switch (action) {
        case 'delete':
          this.$modal.confirm({
            title: `确定要删除字典类型【${dicTypeName}】吗？`,
            onOk: () => {
              this.$store.dispatch({
                type: 'dic/deleteDic',
                payload: {
                  dicId: null,
                  dicTypeCode,
                },
                callback: this.handleReset,
              });
            },
          });
          break;
        default:
          break;
      }
    },
    handleInnerAction(event, innerRecord, record) {
      const { action } = event.target.dataset;
      const { dicId, dicName } = innerRecord;
      // 用此变量是为了删除本地数据，删除具体字典数据时不会重新去请求后端查询
      const { dicTypeCode } = record;
      switch (action) {
        case 'delete':
          this.$modal.confirm({
            title: `确定要删除字典数据【${dicName}】吗？`,
            onOk: () => {
              this.$store.dispatch({
                type: 'dic/deleteDic',
                payload: {
                  dicId,
                  dicTypeCode: null,
                },
                callback: () => {
                  if (record.dicData.length === 1) {
                    this.handleReset();
                  } else {
                    this.$store.commit('dic/DELETE_DIC_DATA', {
                      dicTypeCode,
                      dicId,
                    });
                  }
                },
              });
            },
          });
          break;
        case 'edit':
          this.$store.commit('dic/SET_STATE', {
            isCreateDicDataVisible: 'edit',
            currDicData: {
              dicTypeCode,
              dicTypeName: record.dicTypeName,
              ...innerRecord,
            },
          });
          break;
        default:
          break;
      }
    },
    getDicList() {
      this.$store.dispatch({
        type: 'dic/getDicList',
        payload: {
          data: this.searchData,
          page: this.page,
        },
      });
    },
  },
  mounted() {
    this.getDicList();
  },
};
</script>

<style lang="scss" module>
.dic {
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

    .searchBox {
      flex-grow: 1;
      display: flex;
      justify-content: space-between;

      .searchBoxFilters {
        display: flex;
        flex-grow: 1;

        > div {
          display: flex;
          align-items: center;

          &:not(:last-child) {
            margin-right: 0.28rem;
          }

          > label {
            flex-shrink: 0;
            &::after {
              content: '：';
            }
          }
        }
      }

      .searchBoxBtns {
        flex-shrink: 0;
        margin-left: 0.24rem;
        button {
          &:not(:last-child) {
            margin-right: 0.12rem;
          }
        }
      }
    }

    .extra {
      flex-shrink: 0;
      margin-left: 0.24rem;
    }
  }

  .content {
    h4 {
      margin-bottom: 0.16rem;
    }

    .expandContent {
      padding: 0 0.24rem;
      > div:first-child {
        margin-bottom: 0.1rem;
      }
    }

    .actionColumn {
      color: $primary-color;

      span {
        cursor: pointer;
      }
    }

    .danger {
      color: #f5222d;
    }
  }
}
</style>
