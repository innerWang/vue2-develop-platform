<template>
  <a-modal :visible="isDetailVisible" title="用户详情" @cancel="handleClose" destroy-on-close>
    <ul :class="$style.detailList">
      <li>
        <label>用户工号</label>
        <div>{{ currUserDetail.userNo }}</div>
      </li>
      <li>
        <label>用户名称</label>
        <div>{{ currUserDetail.userName }}</div>
      </li>
      <li>
        <label>用户岗位</label>
        <div>
          <a-tag
            v-for="(role, idx) in formatRoles(currUserDetail.roleList)"
            :key="idx"
            color="cyan"
          >
            {{ role }}
          </a-tag>
        </div>
      </li>
      <li>
        <label>有效状态</label>
        <div>{{ currUserDetail.userSt | formatStatus(VALID_STATUS) }}</div>
      </li>
      <li>
        <label>登录状态</label>
        <div>{{ currUserDetail.userFlag | formatStatus(LOGIN_STATUS) }}</div>
      </li>
      <li>
        <label>锁定状态</label>
        <div>{{ currUserDetail.userLockFlg | formatStatus(LOCK_STATUS) }}</div>
      </li>
      <li>
        <label>所属机构</label>
        <div>{{ currUserDetail.userOrgName }}</div>
      </li>
      <li>
        <label>最近登录时间</label>
        <div>{{ currUserDetail.lstAccessTm | formatTime }}</div>
      </li>
      <li>
        <label>最近签退时间</label>
        <div>{{ currUserDetail.lstLogoutTm | formatTime }}</div>
      </li>
    </ul>
    <template slot="footer">
      <a-button key="ok" type="primary" @click="handleClose">
        关闭
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { formatTime } from '@/utils/helpers';
export default {
  name: 'UserDetail',
  computed: {
    ...mapState('users', ['isDetailVisible', 'currUserDetail']),
    ...mapGetters({
      VALID_STATUS: 'dic/VALID_STATUS',
      LOGIN_STATUS: 'dic/LOGIN_STATUS',
      LOCK_STATUS: 'dic/LOCK_STATUS',
    }),
  },
  methods: {
    handleClose() {
      this.$store.commit('users/SET_STATE', {
        isDetailVisible: false,
        currUserDetail: {},
      });
    },
    formatRoles: (roleMap) => {
      if (Object.prototype.toString.call(roleMap) !== '[object Object]') {
        return [];
      }
      return Object.values(roleMap);
    },
  },
  filters: {
    formatTime,

    formatStatus: (val, dict) => {
      return dict[val];
    },
  },
};
</script>

<style lang="scss" module>
@import '@/styles/mixin';
.detailList {
  @include detailLayout;
}
</style>
