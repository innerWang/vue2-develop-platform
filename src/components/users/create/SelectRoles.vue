<template>
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
    :scroll="{ y: 320 }"
    :row-selection="{ selectedRowKeys: roleCodeList, onChange: onSelectChange }"
  />
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'SelectRoles',
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
          title: '岗位名称',
          key: 'roleName',
          dataIndex: 'roleName',
        },
        {
          title: '岗位状态',
          key: 'roleSt',
          dataIndex: 'roleSt',
          customRender: (val) => this.VALID_STATUS[val],
        },
      ],
    };
  },
  props: {
    roleCodeList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState('role', ['roleList', 'totalCount', 'loading']),
    ...mapGetters('dic', ['VALID_STATUS']),
  },
  methods: {
    handleTableChange(pagination) {
      this.page = {
        pagenum: pagination.current,
        pagesize: pagination.pageSize,
      };
      this.getRoleList();
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.$emit('changeRoles', selectedRowKeys, selectedRows);
    },
    getRoleList() {
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

<style lang="scss" module></style>
