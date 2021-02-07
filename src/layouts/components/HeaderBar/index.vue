<template>
  <header :class="$style.headerBar">
    <div :class="$style.logo">
      <span>开发平台</span>
    </div>
    <div :class="$style['right-menu']">
      <div><!-- search placeholder --></div>

      <!-- 点击跳转到批量导出任务信息 -->
      <!-- <div>
        <a-icon type="cloud-download" />
      </div>
      <div>
        <a-popover placement="topLeft">
          <template #title>
            时间时间
          </template>
          <template #content>
            <div :class="$style.info">
              <p><label>所属部门：</label> <span>xx总行</span></p>
              <p><label>上次登录IP：</label> <span>192.168.9.111</span></p>
              <p><label>上次登录时间：</label> <span>2018-09-09</span></p>
            </div>
          </template>
          <a-icon type="info-circle" />
        </a-popover>
      </div> -->
      <div>
        <a-dropdown placement="bottomRight">
          <div :class="$style.avator">
            <a-icon type="user" />
            <span>{{ userName }}</span>
          </div>
          <template #overlay>
            <a-menu :class="$style.dropdownmenu">
              <a-menu-item key="1">
                <router-link to="/account/settings"><a-icon type="setting" />个人设置</router-link>
              </a-menu-item>
              <a-menu-item key="2">
                <div @click="doLogout"><a-icon type="logout" />退出登录</div>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'HeaderBar',
  props: {},
  computed: {
    ...mapState('user', ['userName']),
  },
  methods: {
    doLogout() {
      this.$store.dispatch('user/logout');
    },
  },
};
</script>

<style lang="scss" module>
.headerBar {
  display: flex;
  align-items: center;
  padding: 0 0.16rem;
  color: #fff;
  background-color: $primary-color;

  .logo {
    margin-right: auto;

    > span {
      font-size: 24px;
    }
  }

  .right-menu {
    display: flex;
    align-items: center;

    > div {
      padding: 0 0.12rem;
    }

    .avator {
      cursor: pointer;

      > span {
        margin-left: 0.06rem;
      }
    }
  }
}

.info {
  padding: 0.04rem 0.1rem;
  border-radius: 4px;
  background-color: #fff;
}

.dropdownmenu {
  :global {
    .ant-dropdown-menu-item {
      .anticon {
        margin-right: 6px;
      }
    }
  }
}
</style>
