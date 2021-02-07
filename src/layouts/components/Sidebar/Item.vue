<script>
import NavItem from './NavItem';
import NavLink from './NavLink';
export default {
  name: 'Item',
  props: ['path', 'meta'],
  render() {
    const { path, meta } = this;
    if (path && meta) {
      return (
        <NavLink to={path}>
          <NavItem meta={meta} />
        </NavLink>
      );
    } else if (meta) {
      return <NavItem meta={meta} />;
    } else {
      return null;
    }
  },
};
</script>
