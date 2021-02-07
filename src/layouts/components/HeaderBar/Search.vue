<template>
  <div :class="$style.headerSearchWrapper">
    <a-icon type="search" />
    <a-select v-model="search" ref="headerSearchSelect" :dropdownClassName="selectClass">
      <a-select-option
        v-for="item in items"
        :key="item.path"
        :value="item"
        :label="item.title.join('>')"
      />
    </a-select>
  </div>
</template>

<script>
export default {
  name: 'HeaderSearch',
  data: function() {
    return {
      visible: false,
      search: '',
      items: [],
    };
  },
  computed: {
    selectClass() {
      return {
        [this.$style.visible]: this.visible,
        [this.$style.select]: true,
      };
    },
  },
};
</script>

<style lang="scss" module>
.headerSearchWrapper {
  .select {
    width: 10px;
  }
}
</style>
