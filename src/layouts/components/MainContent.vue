<template>
  <section>
    <keep-alive :include="cachedViews">
      <router-view />
    </keep-alive>
  </section>
</template>

<script>
export default {
  name: 'MainContent',
  computed: {
    cachedViews() {
      return this.$store.state.tags.cachedViews;
    },
    key() {
      // 设置 router-view 的 key 为 $route.path
      // 如当 /user/1 切换为 /user/2 时，组件强制不复用，重走生命周期钩子
      return this.$route.path;
    },
  },
};
</script>

<style lang="scss" module></style>
