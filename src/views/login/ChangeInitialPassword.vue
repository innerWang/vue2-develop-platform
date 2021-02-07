<template>
  <div :class="$style.changeInitialPassword">
    <div><a-button @click="returnToLogin" type="primary">返回登录页</a-button></div>
    <div :class="$style.title">修改初始密码</div>
    <ChangePwd />
  </div>
</template>

<script>
import ChangePwd from '@/views/account/settings/ChangePwd';
import { clearDB } from '@/utils/auth';
export default {
  name: 'ChangeInitialPassword',
  components: { ChangePwd },
  methods: {
    returnToLogin() {
      clearDB();
      this.$router.push({ path: '/login' });
    },
  },
};
</script>

<style lang="scss" module>
.changeInitialPassword {
  padding: 0.24rem;
  .title {
    margin: 0.24rem;
    font-size: 0.2rem;
    font-weight: 600;
    color: #333;
  }
}
</style>
