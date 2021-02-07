<template>
  <div :class="$style.loginLogWrapper">
    <a-tabs>
      <a-tab-pane tab="登录日志查询" key="1">
        <LoginLogList :orgs="allOrgs" />
      </a-tab-pane>
      <!-- <a-tab-pane tab="登录次数统计" key="2" /> -->
    </a-tabs>
  </div>
</template>

<script>
import LoginLogList from '@/components/loginlog/LoginLogList';
export default {
  name: 'LoginLog',
  data() {
    return {
      allOrgs: [],
    };
  },
  components: { LoginLogList },
  mounted() {
    this.$store.dispatch({
      type: 'org/getAllOrg',
      callback: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          this.allOrgs = data;
        }
      },
    });
  },
};
</script>

<style lang="scss" module>
@import '@/styles/mixin';
.loginLogWrapper {
  @include whiteBgBox;

  :global {
    .ant-tabs-nav {
      .ant-tabs-tab {
        font-size: 0.16rem;
        padding-left: 0;
        padding-right: 0;
      }

      .ant-tabs-tab-active {
        font-weight: 600;
      }
    }
  }
}
</style>
