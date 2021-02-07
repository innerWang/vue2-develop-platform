<template>
  <div :class="$style.loginLayout">
    <header></header>
    <main>
      <div :class="$style.loginForm">
        <h4>用户登录</h4>
        <a-input size="large" placeholder="工号" v-model="userNo">
          <a-icon slot="prefix" type="user" />
        </a-input>
        <a-input size="large" type="password" placeholder="密码" v-model="userPwd">
          <a-icon slot="prefix" type="lock" />
        </a-input>
        <a-button size="large" type="primary" @click="doLogin" :loading="loading">登录</a-button>
      </div>
    </main>
    <footer><p>杭州云象网络科技有限公司</p></footer>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      userNo: '',
      userPwd: '',
    };
  },
  computed: {
    loading() {
      return this.$store.state.user.isLoginLoading;
    },
  },
  methods: {
    doLogin: function() {
      const { userNo, userPwd } = this;
      if (!userNo) {
        this.$message.error('用户名不可为空');
      } else if (!userPwd) {
        this.$message.error('密码不可为空');
      } else {
        this.$store.dispatch({
          type: 'user/login',
          payload: { userNo, userPwd },
          callback: (isFirstLogin) => {
            if (isFirstLogin) {
              this.$router.push({ path: '/changeinitialpassword' });
            } else {
              this.$router.push({ path: '/' });
            }
          },
        });
      }
    },
  },
};
</script>

<style lang="scss" module>
.loginLayout {
  display: flex;
  flex-direction: column;
  height: 100vh;

  header {
    height: 1rem;
  }

  footer {
    height: 0.8rem;
    p {
      text-align: center;
    }
  }

  main {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.loginForm {
  width: 5rem;
  padding: 0.5rem 0.6rem 0.8rem;

  h4 {
    font-size: 0.2rem;
    text-align: center;
    margin-bottom: 0.24rem;
    color: $primary-color;
  }

  :global {
    .ant-input-affix-wrapper {
      margin-bottom: 0.24rem;
    }

    .ant-btn.ant-btn-lg {
      width: 100%;
    }
  }
}
</style>
