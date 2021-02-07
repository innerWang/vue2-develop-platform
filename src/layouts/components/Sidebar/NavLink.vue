<template>
  <!--  动态组件 -->
  <component :is="tag" v-bind="calcAttrs()">
    <slot></slot>
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate';
export default {
  name: 'NavLink',
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  computed: {
    tag: function() {
      if (isExternal(this.to)) {
        return 'a';
      }
      return 'router-link';
    },
  },
  methods: {
    calcAttrs: function() {
      const { to } = this;
      if (isExternal(to)) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener',
        };
      }
      return {
        to,
      };
    },
  },
};
</script>
