<template>
  <div :class="$style.accountSettings">
    <div :class="$style.left">
      <a-menu :selectedKeys="selectedKeys" mode="inline">
        <a-menu-item key="/account/settings/base">
          <router-link :to="{ name: 'AccountBaseSetting' }">
            基本设置
          </router-link>
        </a-menu-item>
        <a-menu-item key="/account/settings/security">
          <router-link :to="{ name: 'AccountChangePwd' }">
            修改密码
          </router-link>
        </a-menu-item>
      </a-menu>
    </div>
    <div :class="$style.right">
      <div :class="$style.infoTitle">
        <span>{{ $route.meta.title }}</span>
      </div>
      <RouteView />
    </div>
  </div>
</template>

<script>
import RouteView from '@/layouts/RouteView';
import { mapState } from 'vuex';
export default {
  name: 'AccountSettings',
  data() {
    return {
      selectedKeys: [],
    };
  },
  computed: {
    ...mapState('app', ['showTags']),
  },
  components: { RouteView },
  methods: {
    updateMenu() {
      const routes = this.$route.matched.concat();
      this.selectedKeys = [routes.pop().path];
    },
  },
  created() {
    if (this.showTags) {
      const route = this.$route.matched.find((r) => r.name === 'AccountSettings');
      if (route) {
        this.$store.dispatch('tags/addCachedView', route);
      }
    }
  },
  mounted() {
    this.updateMenu();
  },
  watch: {
    $route: function() {
      this.updateMenu();
    },
  },
};
</script>

<style lang="scss" module>
@import '@/styles/mixin';
.accountSettings {
  @include whiteBgBox;
  display: flex;
  padding-left: 0;

  .left {
    width: 2rem;

    :global {
      .ant-menu {
        height: 100%;
      }
    }
  }

  .right {
    padding-left: 0.24rem;
    flex-grow: 1;

    .infoTitle {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      margin-bottom: 12px;
    }
  }
}
</style>
