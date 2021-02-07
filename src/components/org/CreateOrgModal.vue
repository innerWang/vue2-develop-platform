<template>
  <a-modal
    title="新增机构"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    destroy-on-close
  >
    <a-form-model
      ref="orgForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item ref="orgNo" label="机构代码" prop="orgNo">
        <a-input v-model="form.orgNo" />
      </a-form-model-item>
      <a-form-model-item ref="orgName" label="机构名称" prop="orgName">
        <a-input v-model="form.orgName" />
      </a-form-model-item>
      <!-- 新建时正常不应该出现总行的级别，但是由于key和value都可以改，前端无法排除，靠后端报错 -->
      <a-form-model-item ref="orgLvl" label="机构级别" prop="orgLvl">
        <a-select v-model="form.orgLvl" allow-clear>
          <a-select-option
            v-for="option in ORG_LEVEL_OPTIONS"
            :key="option.key"
            :value="option.key"
          >
            {{ option.value }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="orgUpCode" label="上级机构" prop="orgUpCode">
        <a-tree-select
          v-model="form.orgUpCode"
          :tree-data="orgTree"
          allow-clear
          :replaceFields="{ title: 'orgName', key: 'orgCode', value: 'orgCode' }"
        />
      </a-form-model-item>
      <a-form-model-item ref="orgMngCode" label="账务机构" prop="orgMngCode">
        <a-tree-select
          v-model="form.orgMngCode"
          :tree-data="orgTree"
          allow-clear
          :replaceFields="{ title: 'orgName', key: 'orgCode', value: 'orgCode' }"
        />
      </a-form-model-item>
      <a-form-model-item ref="orgPostno" label="邮政编码" prop="orgPostno">
        <a-input v-model="form.orgPostno" />
      </a-form-model-item>
      <a-form-model-item ref="orgAddr" label="机构地址" prop="orgAddr">
        <a-input v-model="form.orgAddr" />
      </a-form-model-item>
    </a-form-model>
    <template slot="footer">
      <a-button key="back" @click="handleCancel" :disable="loading">
        取消
      </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
        确定
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { orgRules } from '@/constants/rules';
export default {
  name: 'CreateOrgModal',
  props: {
    onSuccess: {
      type: Function,
      default: () => {},
    },
    orgTree: {
      type: Array,
      default: () => [],
    },
  },
  data: function() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      form: {
        orgNo: '',
        orgName: '',
        orgLvl: '',
        orgUpCode: '',
        orgMngCode: '',
        orgPostno: '',
        orgAddr: '',
      },
      rules: orgRules,
    };
  },
  computed: {
    ...mapState({
      visible: (state) => state.org.isCreateVisible,
      loading: (state) => state.org.createLoading,
    }),
    ...mapGetters({
      ORG_LEVEL_OPTIONS: 'dic/ORG_LEVEL_OPTIONS',
    }),
  },
  methods: {
    handleCancel() {
      this.$store.commit('org/SET_FIELD', { field: 'isCreateVisible', value: false });
      this.$refs.orgForm.resetFields();
    },
    handleOk() {
      const formRef = this.$refs.orgForm;

      formRef.validate((valid) => {
        if (!valid) {
          return false;
        }

        this.$store.dispatch({
          type: 'org/createOrg',
          payload: this.form,
          callback: () => {
            this.handleCancel();
            this.onSuccess();
          },
        });
      });
    },
  },
};
</script>

<style lang="scss" module></style>
