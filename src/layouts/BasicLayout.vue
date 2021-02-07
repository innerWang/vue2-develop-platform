<template>
  <div :class="$style.basicLayoutWrapper">
    <HeaderBar />
    <main>
      <Sidebar />
      <div :class="$style.right">
        <TagsNav v-if="showTags" />
        <BreadCrumbNav />
        <MainContent />
      </div>
    </main>
  </div>
</template>

<script>
import HeaderBar from './components/HeaderBar';
import Sidebar from './components/Sidebar';
import TagsNav from './components/TagsNav';
import MainContent from './components/MainContent';
import BreadCrumbNav from './components/BreadCrumbNav';
import { mapState } from 'vuex';

export default {
  name: 'BasicLayout',
  computed: {
    ...mapState('app', ['showTags']),
  },
  components: {
    HeaderBar,
    Sidebar,
    TagsNav,
    MainContent,
    BreadCrumbNav,
  },
  mounted() {},
};
</script>

<style lang="scss" module>
.basicLayoutWrapper {
  height: 100vh;
  > header {
    height: 0.6rem;
  }
  > main {
    display: flex;
    height: calc(100% - 0.6rem);
  }

  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    /* 对应主面板区域的高度 */
    > section {
      flex-grow: 1;
      padding: 0.24rem;
      overflow: scroll;
    }
  }
}
</style>
