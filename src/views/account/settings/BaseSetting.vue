<template>
  <div>
    <a-form-model
      :model="form"
      :rules="rules"
      :label-col="{ span: 3 }"
      :wrapper-col="{ span: 8 }"
      ref="baseSettingForm"
    >
      <a-form-model-item label="电子邮件" :required="false" prop="userEmail">
        <a-input placeholder="exp@admin.com" v-model="form.userEmail" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 8, offset: 3 }">
        <a-button type="primary" @click="handleSubmit" :loading="loading">提交</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { userBaseSettingRules } from '@/constants/rules';
export default {
  name: 'AccountBaseSetting',
  data() {
    return {
      form: {
        userCode: '',
        userEmail: '',
      },
      rules: userBaseSettingRules,
      loading: false,
    };
  },
  methods: {
    handleSubmit() {
      const formRef = this.$refs.baseSettingForm;
      formRef.validate((valid) => {
        if (!valid) {
          return false;
        }
        this.loading = true;
        this.$store.dispatch({
          type: 'user/setPersonalSettings',
          payload: this.form,
          callback: () => {
            this.loading = false;
          },
        });
      });
    },
  },
  mounted() {
    this.$store.dispatch({
      type: 'user/getPersonalSettings',
      callback: (data) => {
        if (Object.prototype.toString.call(data) === '[object Object]') {
          for (const k in this.form) {
            if (Object.prototype.hasOwnProperty.call(this.form, k)) {
              this.form[k] = data[k];
            }
          }
        }
      },
    });
  },
};
</script>

<style lang="scss" module></style>
