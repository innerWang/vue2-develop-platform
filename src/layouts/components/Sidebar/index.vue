<script>
import Item from './Item';
import { mapState } from 'vuex';
export default {
  name: 'Sidebar',
  data: function() {
    return {
      collapsed: false,
      openKeys: [], // 默认只展开一个submenu
    };
  },
  computed: {
    current() {
      return [this.$route.path];
    },
    ...mapState('permission', ['navMenu']),
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
      if (this.collapsed) {
        this.openKeys = [];
      } else {
        this.openKeys = this.calcOpenKeys(this.navMenu, this.current[0]);
      }
    },
    onOpenChange(keys) {
      const latestOpenKey = keys.find((key) => this.openKeys.indexOf(key) === -1);
      this.openKeys = latestOpenKey ? [latestOpenKey] : [];
    },
    calcOpenKeys(navs, currPath) {
      const parents = this.findParents(navs, currPath);
      if (parents === -1) {
        return [];
      }
      // const idx = parents.indexOf('0');
      // idx !== -1 && parents.splice(idx, 1);
      return parents;
    },
    findParents(data, path, parents = []) {
      let arr = [...parents];
      for (let i = 0, len = data.length; i < len; i++) {
        const item = data[i];
        arr.push(item.parentId);
        if (item.path === path) {
          return arr;
        }
        if (item.children && item.children.length) {
          const result = this.findParents(item.children, path, arr);
          if (result !== -1) return result;
        }
        arr.pop();
      }
      return -1;
    },
  },
  mounted() {
    this.openKeys = this.calcOpenKeys(this.navMenu, this.current[0]);
  },
  render() {
    const { $style, openKeys, collapsed, current, navMenu } = this;
    const renderSubMenu = (menu) => {
      return (
        <a-sub-menu key={menu.key}>
          <template slot="title">
            <Item meta={menu.meta} />
          </template>
          {menu.children.map((m) =>
            m.children && m.children.length ? (
              renderSubMenu(m)
            ) : (
              <a-menu-item key={m.path}>
                <Item meta={m.meta} path={m.path} />
              </a-menu-item>
            )
          )}
        </a-sub-menu>
      );
    };
    return (
      <div class={$style.sidebar}>
        <div class={$style.menuWrapper}>
          <a-menu
            openKeys={openKeys}
            onOpenChange={this.onOpenChange}
            selectedKeys={current}
            mode="inline"
            inlineCollapsed={collapsed}
          >
            {navMenu.map((m) =>
              m.children && m.children.length ? (
                renderSubMenu(m)
              ) : (
                <a-menu-item key={m.path}>
                  <Item meta={m.meta} path={m.path} />
                </a-menu-item>
              )
            )}
          </a-menu>
        </div>
        <div class={$style.toggleIconWrapper}>
          <span onClick={this.toggleCollapsed} class={$style.toggleIcon}>
            <a-icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
          </span>
        </div>
      </div>
    );
  },
};
</script>

<style lang="scss" module>
.sidebar {
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
  z-index: 1;
  .menuWrapper {
    flex: 1;
    overflow-y: scroll;

    :global {
      .ant-menu {
        min-height: 100%;
        &.ant-menu-inline {
          min-width: 2.2rem;
          border-right: none;
        }

        &.ant-menu-inline,
        &.ant-menu-inline-collapsed {
          .ant-menu-item,
          .ant-menu-submenu-title {
            margin: 0;
            border-bottom: 1px solid #ededed;
          }
        }
      }
    }
  }

  .toggleIconWrapper {
    padding: 0.1rem;
    border-top: 1px solid #eee;

    .toggleIcon {
      cursor: pointer;
      border: 10px solid transparent;
      background-clip: padding-box;
    }
  }
}
</style>
