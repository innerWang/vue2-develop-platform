<template>
  <ul :class="$style.confirmInfo">
    <li>
      <label>用户工号</label>
      <div>{{ detail.userNo }}</div>
    </li>
    <li>
      <label>用户名称</label>
      <div>{{ detail.userName }}</div>
    </li>
    <li>
      <label>所属机构</label>
      <div>{{ detail.orgName }}</div>
    </li>
    <li>
      <label>所属岗位</label>
      <div>
        <a-tag v-for="(role, idx) in formatRoles(detail.roleList)" :key="idx" color="cyan">
          {{ role }}
        </a-tag>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ConfirmInfo',
  props: {
    detail: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    formatRoles(val) {
      if (Object.prototype.toString.call(val) === '[object Object]') {
        return Object.values(val);
      }
      return [];
    },
  },
};
</script>

<style lang="scss" module>
.confirmInfo {
  padding-left: 0.24rem;
  li {
    display: flex;
    margin-bottom: 0.1rem;
    font-size: 0.16rem;
    > label {
      flex-shrink: 0;
      width: 1rem;
      color: rgba($color: #888, $alpha: 0.8);
      text-align: right;
      &::after {
        content: '：';
      }
    }
    > div {
      flex-grow: 1;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
}
</style>
