<template>
  <a-modal :visible="isDetailVisible" title="系统参数详情" @cancel="handleClose" destroy-on-close>
    <ul :class="$style.list">
      <li>
        <label>参数名称</label>
        <div>{{ currParam.parmCode }}</div>
      </li>
      <li>
        <label>参数值</label>
        <div>{{ currParam.parmValue }}</div>
      </li>
      <li>
        <label>参数描述</label>
        <div>{{ currParam.parmDesc }}</div>
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
import { mapState } from 'vuex';
export default {
  name: 'ParamDetail',
  computed: { ...mapState('param', ['isDetailVisible', 'currParam']) },
  methods: {
    handleClose() {
      this.$store.commit('param/SET_STATE', { isDetailVisible: false, currParam: {} });
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
