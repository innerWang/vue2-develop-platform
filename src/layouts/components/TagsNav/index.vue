<template>
  <div :class="$style.tagsNav">
    <div :class="$style.nav">
      <div :class="navContentClasses">
        <div :class="$style.scrollWrapper" ref="scrollWrapper">
          <div :class="$style.scrollBody" ref="scrollBody" :style="{ left: scrollBodyLeft + 'px' }">
            <router-link
              v-for="tag in visitedViews"
              :key="tag.path"
              :to="{ path: tag.path }"
              tag="span"
              ref="tag"
              :class="{
                [$style.tagActive]: isActive(tag),
                [$style.tagItem]: true,
              }"
            >
              {{ tag.title }}
              <span
                v-if="!isAffix(tag)"
                @click.prevent.stop="closeSelectedTag(tag)"
                :class="$style.closeTagIcon"
              />
            </router-link>
          </div>
        </div>
        <span :class="$style.navPrev" v-if="isScroll" @click.stop="handleScroll(200)">
          <a-icon type="left" />
        </span>
        <span :class="$style.navNext" v-if="isScroll" @click.stop="handleScroll(-200)">
          <a-icon type="right" />
        </span>
      </div>
    </div>
    <div :class="$style.more">
      <a-dropdown placement="bottomRight">
        <div :class="$style.moreIcon"><a-icon type="plus-circle" /></div>
        <a-menu slot="overlay" @click="handleMoreMenuClick">
          <a-menu-item key="others">关闭其他</a-menu-item>
          <a-menu-item key="all">关闭所有</a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'TagsNav',
  data() {
    return {
      isScroll: false,
      affixTags: [],
      scrollBodyLeft: 0, // 该值应为一个小于等于0的数
    };
  },
  computed: {
    navContentClasses() {
      return {
        [this.$style['navContent']]: true,
        [this.$style['isScroll']]: this.isScroll,
      };
    },
    ...mapState('tags', ['visitedViews']),
    ...mapState('permission', ['accessRoutes']),
  },
  mounted() {
    this.initTags();
    this.addTags();
  },
  watch: {
    $route() {
      this.addTags();
      this.moveToCurrentTag();
    },
  },
  methods: {
    isActive(tag) {
      return tag.path === this.$route.path;
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix;
    },
    filterAffixTags(routes) {
      let tags = [];
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          tags.push({
            path: route.path,
            name: route.name,
            meta: { ...route.meta },
          });
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children);
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags];
          }
        }
      });
      return tags;
    },
    initTags() {
      // 过滤所有路由，拿到需要固定的路由，添加到 visitedViews
      this.affixTags = this.filterAffixTags(this.accessRoutes);
      const initialAffixTags = this.affixTags.filter((tag) => tag.name);
      this.$store.commit('tags/INIT_VISITED_VIEWS', initialAffixTags);
    },
    addTags() {
      const { name, path, meta } = this.$route;
      if (name) {
        this.$store.dispatch('tags/addView', {
          name,
          path,
          meta: { ...meta },
        });
      }
      return false;
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.moveToTarget(tag);
            break;
          }
        }
      });
    },
    getScrollWrapperAndBodyWidth() {
      return {
        wrapperWidth: this.$refs.scrollWrapper.clientWidth,
        bodyWidth: this.$refs.scrollBody.clientWidth,
      };
    },
    moveToTarget(tag) {
      const { wrapperWidth, bodyWidth } = this.getScrollWrapperAndBodyWidth();
      if (bodyWidth <= wrapperWidth) {
        this.scrollBodyLeft = 0;
        this.isScroll = false;
      } else {
        // 若有border，计算宽度时则需要使用 offsetWidth， clientWidth 不包含 border
        // 1. 标签的右侧在可视区域的右侧，需要左移，
        // 2. 标签的左侧在可视区域的左侧，需要右移，
        // 3. 其他情况，左移的距离大于 wrapper -body 的距离，需要重置
        this.isScroll = true;
        this.$nextTick(() => {
          const {
            wrapperWidth: currWrapperWidth,
            bodyWidth: currBodyWidth,
          } = this.getScrollWrapperAndBodyWidth();
          const { offsetWidth, offsetLeft } = tag.$el;
          const tagRightToWrapperLeft = offsetWidth + offsetLeft + this.scrollBodyLeft;
          const tagLeftToWrapperLeft = offsetLeft + this.scrollBodyLeft;
          if (tagRightToWrapperLeft > currWrapperWidth) {
            const a = currWrapperWidth + this.scrollBodyLeft - tagRightToWrapperLeft + 16;
            const b = currWrapperWidth - currBodyWidth;
            this.scrollBodyLeft = Math.min(a, b);
          } else if (tagLeftToWrapperLeft < 0) {
            this.scrollBodyLeft = Math.min(this.scrollBodyLeft - tagLeftToWrapperLeft + 16, 0);
          } else if (this.scrollBodyLeft < currWrapperWidth - bodyWidth) {
            this.scrollBodyLeft = currWrapperWidth - bodyWidth;
          }
        });
      }
    },
    handleScroll(offset) {
      const { wrapperWidth, bodyWidth } = this.getScrollWrapperAndBodyWidth();
      if (offset > 0) {
        // 想要显示左侧区域，left 需要大于0， 等价于右移
        if (this.scrollBodyLeft === 0) {
          return;
        }
        this.scrollBodyLeft = Math.min(0, this.scrollBodyLeft + offset);
      } else {
        // 想要显示右侧区域，left 需要小于0， 等价于左移
        if (wrapperWidth >= bodyWidth) {
          this.scrollBodyLeft = 0;
        } else {
          const maxLeftOffset = wrapperWidth - bodyWidth;
          if (this.scrollBodyLeft <= maxLeftOffset) {
            return;
          }
          this.scrollBodyLeft = Math.max(maxLeftOffset, this.scrollBodyLeft + offset);
        }
      }
    },
    closeSelectedTag(tag) {
      this.$store.dispatch('tags/delView', tag).then(({ visitedViews }) => {
        if (this.isActive(tag)) {
          this.toLastView(visitedViews, tag);
        } else {
          this.moveToCurrentTag();
        }
      });
    },
    toLastView(visitedViews, currTag) {
      const lastestView = visitedViews.slice(-1)[0];
      if (lastestView) {
        this.$router.push(lastestView.path);
      } else {
        if (currTag.name === 'Dashboard') {
          // todo： 此处需要增加重定向，当没有一个路由时，可以强制刷新一次主页
          this.$router.replace('/redirect' + currTag.path);
        } else {
          this.$router.push('/');
        }
      }
    },
    handleMoreMenuClick(e) {
      const activeTag = this.visitedViews.find((t) => t.path === this.$route.path);
      switch (e.key) {
        case 'others':
          if (!activeTag) return;
          this.$store.dispatch('tags/delOthersViews', activeTag).then(() => {
            this.moveToCurrentTag();
          });
          break;
        case 'all':
          this.$store.dispatch('tags/delAllViews').then(({ visitedViews }) => {
            if (this.affixTags.some((tag) => tag.path === activeTag.path)) {
              return;
            }
            this.toLastView(visitedViews, activeTag);
          });
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" module>
.tagsNav {
  $tag-nav-height: 0.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.2rem;
  width: 100%;
  height: $tag-nav-height;
  background-color: #fff;

  .nav {
    height: $tag-nav-height;
    flex-grow: 1;
  }

  .navContent {
    position: relative;

    .navPrev,
    .navNext {
      position: absolute;
      top: 0;
      bottom: 0;
      height: $tag-nav-height;
      line-height: $tag-nav-height;
      background-color: #fff;
      font-size: 0.14rem;
      font-weight: 600;

      &:hover {
        cursor: pointer;
        color: $primary-color;
      }
    }

    .navPrev {
      left: 0;
    }
    .navNext {
      right: 0;
    }

    .scrollWrapper {
      position: relative;
      overflow: hidden;
      height: $tag-nav-height;
      //  background-color: #f1f1f1;
    }

    .scrollBody {
      position: absolute;
      bottom: 0;
      top: 0;
      display: flex;
      align-items: center;
      white-space: nowrap;
      transition: left 0.3s ease;
    }

    .tagItem {
      display: inline-flex;
      align-items: center;
      padding: 0.04rem 0.1rem;
      font-size: 0.14rem;
      border-radius: 2px;
      border: 1px solid #dcdfe6;
      color: #585858;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 0.06rem;
        background-color: #e8eaec;
      }

      &:not(:last-child) {
        margin-right: 0.06rem;
      }

      .closeTagIcon {
        margin-left: 0.06rem;
        width: 14px;
        height: 14px;
        font-size: 12px;
        text-align: center;
        line-height: 14px;
        border-radius: 50%;
        transition: background-color 0.2s ease;
        &::after {
          content: 'x';
        }

        &:hover {
          background-color: #c0c4cc;
          color: #fff;
        }
      }

      &.tagActive {
        color: #fff;
        background-color: $primary-color;
        border-color: $primary-color;
        &::before {
          background-color: #fff;
        }
      }
    }

    &.isScroll {
      padding: 0 0.2rem;
    }
  }

  .more {
    flex-shrink: 0;
    margin-left: 0.24rem;

    .moreIcon {
      padding: 0.06rem 0.1rem;
      color: #666;
      &:hover {
        cursor: pointer;
        color: $primary-color;
      }
      :global {
        .anticon {
          width: 0.16rem;
          height: 0.16rem;
        }
      }
    }
  }
}
</style>
