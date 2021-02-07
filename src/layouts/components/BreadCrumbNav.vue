<template>
  <div :class="$style.breadCrumb">
    <a-breadcrumb>
      <a-breadcrumb-item v-for="(item, idx) in levelList" :key="item.path">
        <span v-if="item.redirect || idx === levelList.length - 1">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleClickLink(item)">{{ item.meta.title }}</a>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'BreadCrumbNav',
  data() {
    return {
      levelList: [],
    };
  },
  created() {
    this.getBreadCrumb();
  },
  watch: {
    $route(route) {
      if (route.path.startsWith('/redirect/')) {
        return;
      }
      this.getBreadCrumb();
    },
  },
  methods: {
    getBreadCrumb() {
      const matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.title && !item.meta.hideInBread
      );
      const first = matched[0];
      if (!this.isDashboard(first)) {
        matched.unshift({ path: '/dashboard', meta: { title: '主页' } });
      }
      this.levelList = matched;
    },
    isDashboard(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase();
    },
    handleClickLink(item) {
      this.$router.push(item.path);
    },
  },
};
</script>

<style lang="scss" module>
.breadCrumb {
  width: 100%;
  padding: 0.12rem 0.24rem;
  font-size: 0.16rem;
  background-color: #fff;
  border-top: 1px solid #f3f3f3;
}
</style>
