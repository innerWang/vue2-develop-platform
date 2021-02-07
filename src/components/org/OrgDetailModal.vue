<template>
  <a-modal title="机构详情" :visible="visible" @cancel="handleClose" destroy-on-close>
    <ul :class="$style.list">
      <li>
        <label>机构代码</label>
        <div>{{ detail.orgNo }}</div>
      </li>
      <li>
        <label>机构名称</label>
        <div>{{ detail.orgName }}</div>
      </li>
      <li>
        <label>机构级别</label>
        <div>{{ ORG_LEVEL[detail.orgLvl] }}</div>
      </li>
      <li>
        <label>上级机构</label>
        <div>{{ detail.orgUpName }}</div>
      </li>
      <li>
        <label>账务机构</label>
        <div>{{ detail.orgMngName }}</div>
      </li>
      <li>
        <label>邮政编码</label>
        <div>{{ detail.orgPostno }}</div>
      </li>
      <li>
        <label>机构地址</label>
        <div>{{ detail.orgAddr }}</div>
      </li>
    </ul>
    <template slot="footer">
      <a-button key="ok" type="primary" @click="handleClose">
        关闭
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
  name: 'OrgDetailModal',
  computed: {
    ...mapState({
      visible: (state) => state.org.isDetailVisible,
      detail: (state) => state.org.currOrg,
    }),
    ...mapGetters({
      ORG_LEVEL: 'dic/ORG_LEVEL',
    }),
  },
  methods: {
    handleClose() {
      this.$store.commit('org/SET_STATE', { isDetailVisible: false, currOrg: {} });
    },
    // 直接后端返回上级机构的名称，不去遍历树计算
    findTitle(key) {
      let title = '-';
      const getTitle = (tree, k) => {
        for (const node of tree) {
          if (node.key === k) {
            title = node.title;
          } else if (!node.isLeaf) {
            getTitle(node.children, k);
          }
        }
      };
      getTitle(this.orgTree || [], key);
      return title;
    },
  },
};
</script>

<style lang="scss" module>
@import '@/styles/mixin';
.list {
  @include detailLayout;
}
</style>
