<template>
  <a-modal
    :visible="isEditVisible"
    title="修改系统参数"
    @cancel="handleCancel"
    @ok="handleOk"
    :maskClosable="false"
    destroy-on-close
    :cancel-button-props="{ props: { disabled: isEditLoading } }"
    :confirmLoading="isEditLoading"
  >
    <a-form-model
      ref="paramForm"
      :model="form"
      :rules="rules"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-model-item label="参数名称" prop="parmCode">
        <a-input v-model="form.parmCode" disabled />
      </a-form-model-item>
      <a-form-model-item label="参数值" prop="parmValue">
        <a-input v-model="form.parmValue" />
      </a-form-model-item>
      <a-form-model-item label="参数描述" prop="parmDesc">
        <a-textarea v-model="form.parmDesc" :rows="4" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { mapState } from 'vuex';
import { paramRules } from '@/constants/rules';
export default {
  name: 'EditParam',
  data() {
    return {
      form: {
        parmCode: '',
        parmValue: '',
        parmDesc: '',
      },
      rules: paramRules,
    };
  },
  computed: {
    ...mapState('param', ['isEditVisible', 'isEditLoading', 'currParam']),
  },
  methods: {
    handleCancel() {
      this.$store.commit('param/SET_STATE', { isEditVisible: false, currParam: {} });
      this.$refs.paramForm.resetFields();
    },
    handleOk() {
      this.$refs.paramForm.validate((valid) => {
        if (!valid) {
          return false;
        }
        this.$store.dispatch({
          type: 'param/updateParam',
          payload: this.form,
          callback: () => {
            this.handleCancel();
          },
        });
      });
    },
  },
  watch: {
    isEditVisible(val, oldVal) {
      if (val && !oldVal) {
        for (const k in this.form) {
          if (Object.prototype.hasOwnProperty.call(this.form, k)) {
            this.form[k] = this.currParam[k];
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" module></style>
