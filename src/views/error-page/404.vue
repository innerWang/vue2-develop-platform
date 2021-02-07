<template>
  <a-result status="404" title="404" sub-title="对不起，你所访问的页面不存在!">
    <template #extra>
      <a-button type="primary" @click="handleBackToDashboard">
        返回主页
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'Page404',
  methods: {
    handleBackToDashboard() {
      this.$router.push('/dashboard');
    },
  },
};
</script>

<style lang="scss" module></style>
