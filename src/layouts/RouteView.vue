<script>
export default {
  name: 'RouteView',
  render() {
    const {
      state: {
        app: { showTags },
      },
    } = this.$store;

    const inKeep = (
      <keep-alive>
        <router-view />
      </keep-alive>
    );
    const notKeep = <router-view />;

    // 没有开启多页认为不需要缓存
    return showTags ? inKeep : notKeep;
  },
};
</script>
