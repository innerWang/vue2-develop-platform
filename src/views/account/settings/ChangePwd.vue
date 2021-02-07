<template>
  <div :class="$style.changepwd">
    <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" :form="form">
      <a-form-item label="当前密码">
        <a-input-password
          v-decorator="['password', { rules: rules.password.concat({ validator: checkPwd }) }]"
          name="password"
        />
      </a-form-item>
      <a-form-item label="新密码">
        <a-input-password
          v-decorator="[
            'newPassword',
            { rules: rules.newPassword.concat({ validator: checkNewPwd }), validateFirst: true },
          ]"
          name="newPassword"
          @blur="handleConfirmBlur"
        />
      </a-form-item>
      <a-form-item label="确认新密码">
        <a-input-password
          v-decorator="[
            'confirmPassword',
            { rules: rules.confirmPassword.concat({ validator: checkConfirmPwdMatch }) },
          ]"
          @blur="handleConfirmBlur"
          name="confirmPassword"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 16, offset: 6 }">
        <a-button type="primary" @click="handleSubmit" :loading="loading">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { passwordRules } from '@/constants/rules';
export default {
  name: 'AccountChangePwd',
  data() {
    return {
      rules: passwordRules,
      // 表示新密码是否有值
      newDirty: false,
      // 表示确认密码是否有值
      confirmDirty: false,
      loading: false,
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'changePwd' });
  },
  methods: {
    checkPwd(rule, value, callback) {
      const form = this.form;
      if (value && this.newDirty) {
        form.validateFields(['newPassword'], { force: true });
      }
      callback();
    },
    checkNewPwd(rule, value, callback) {
      const form = this.form;
      if (value) {
        if (value === form.getFieldValue('password')) {
          callback('新密码与当前密码一致！');
        }
        if (this.confirmDirty) {
          form.validateFields(['confirmPassword'], { force: true });
        }
      }
      callback();
    },
    checkConfirmPwdMatch(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue('newPassword')) {
        callback('确认新密码与新密码不一致!');
      } else {
        callback();
      }
    },
    handleConfirmBlur(e) {
      const { value, name } = e.target;
      switch (name) {
        case 'newPassword':
          this.newDirty = !!value;
          break;
        case 'confirm':
          this.confirmDirty = !!value;
          break;
        default:
          break;
      }
    },
    handleSubmit() {
      this.form.validateFields((errors, values) => {
        if (!errors) {
          this.loading = true;
          this.$store.dispatch({
            type: 'user/changePassword',
            payload: {
              oldPassword: values.password,
              newPassword: values.newPassword,
            },
            callbackOk: () => {
              this.$store.dispatch('user/logout');
            },
            callback: () => {
              this.loading = false;
            },
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" module>
.changepwd {
  width: 5rem;
}
</style>
