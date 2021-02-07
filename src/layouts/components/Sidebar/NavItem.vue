<template>
  <span>
    <a-icon v-if="meta.icon" :type="meta.icon" />
    <span v-if="meta.title">{{ meta.title }}</span>
  </span>
</template>

<script>
export default {
  name: 'NavItem',
  props: {
    meta: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
