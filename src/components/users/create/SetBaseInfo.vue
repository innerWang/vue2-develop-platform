<template>
  <a-form-model
    ref="form"
    :model="formData"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item ref="userNo" label="用户工号" prop="userNo">
      <a-input v-model="formData.userNo" :disabled="isEdit" />
    </a-form-model-item>
    <a-form-model-item ref="userName" label="用户名称" prop="userName">
      <a-input v-model="formData.userName" />
    </a-form-model-item>
    <a-form-model-item ref="userOrgCode" label="所属机构" prop="userOrgCode">
      <a-select v-model="formData.userOrgCode" allow-clear>
        <a-select-option v-for="org in orgs" :key="org.orgCode" :value="org.orgCode">
          {{ org.orgName }}
        </a-select-option>
      </a-select>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { userRules } from '@/constants/rules';
export default {
  name: 'SetBaseInfo',
  data() {
    return {
      rules: userRules,
    };
  },
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    orgs: {
      type: Array,
      default: () => [],
    },
    isEdit: Boolean,
    labelCol: Object,
    wrapperCol: Object,
  },
};
</script>

<style lang="scss" module></style>
