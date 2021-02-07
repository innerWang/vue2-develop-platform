<template>
  <a-modal
    :visible="!!isCreateVisible"
    :title="isCreateVisible === 'edit' ? '修改用户信息' : '新增用户'"
    @cancel="handleCancel"
    @ok="handleOk"
    :maskClosable="false"
    destroy-on-close
    :wrapClassName="$style.userModal"
  >
    <a-steps :current="step" :class="$style.steps">
      <a-step title="基础信息" />
      <a-step title="选择岗位" />
      <a-step title="确认并提交" />
    </a-steps>
    <div :class="$style.content">
      <SetBaseInfo
        v-if="step === 0"
        ref="setBaseInfo"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        :formData="baseInfoForm"
        :isEdit="isCreateVisible === 'edit'"
        :orgs="orgs"
      />
      <SelectRoles
        v-if="step === 1"
        :roleCodeList="Object.keys(roleList)"
        @changeRoles="changeSelectedRoles"
      />
      <ConfirmInfo v-if="step === 2" :detail="confirmInfo" />
    </div>
    <template slot="footer">
      <template v-if="step === 0">
        <a-button @click="handleCancel">
          取消
        </a-button>
        <a-button type="primary" @click="handleNext">
          下一步
        </a-button>
      </template>
      <template v-if="step === 1">
        <a-button @click="handlePrev">
          上一步
        </a-button>
        <a-button type="primary" @click="handleNext">
          下一步
        </a-button>
      </template>
      <template v-if="step === 2">
        <a-button @click="handlePrev" :disable="isCreateLoading">
          上一步
        </a-button>
        <a-button type="primary" :loading="isCreateLoading" @click="handleOk">
          提交
        </a-button>
      </template>
    </template>
  </a-modal>
</template>

<script>
import { mapState } from 'vuex';
import SetBaseInfo from './create/SetBaseInfo';
import SelectRoles from './create/SelectRoles';
import ConfirmInfo from './create/ConfirmInfo';

export default {
  name: 'CreateUser',
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      orgs: [],
      step: 0,
      baseInfoForm: {
        userNo: '',
        userName: '',
        userOrgCode: '',
      },
      roleList: {},
      // 主要含有 userNo，userName, orgName, roleList
      confirmInfo: {},
    };
  },
  props: {
    onCreateSuccess: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapState('users', ['isCreateVisible', 'isCreateLoading', 'currUserDetail']),
  },
  components: { SetBaseInfo, SelectRoles, ConfirmInfo },
  methods: {
    resetData() {
      this.step = 0;
      this.baseInfoForm = {
        userNo: '',
        userName: '',
        userOrgCode: '',
      };
      this.roleList = {};
      this.confirmInfo = {};
    },
    handleOk() {
      const { baseInfoForm, roleList, isCreateVisible } = this;
      const roleCodeList = Object.keys(roleList);
      if (isCreateVisible === 'edit') {
        this.$store.dispatch({
          type: 'users/updateUserDetail',
          payload: {
            ...baseInfoForm,
            roleCodeList,
            userCode: this.currUserDetail.userCode,
          },
          callback: () => {
            this.handleCancel();
          },
        });
      } else if (isCreateVisible) {
        this.$store.dispatch({
          type: 'users/createUser',
          payload: {
            ...baseInfoForm,
            roleCodeList,
          },
          callback: () => {
            this.handleCancel();
            this.onCreateSuccess();
          },
        });
      }
    },
    handleCancel() {
      this.$store.commit('users/SET_STATE', { isCreateVisible: false, currUserDetail: {} });
      this.resetData();
    },
    handlePrev() {
      this.step -= 1;
    },
    handleNext() {
      switch (this.step) {
        case 0:
          this.$refs.setBaseInfo.$refs.form.validate((valid) => {
            if (!valid) {
              return false;
            }
            let orgName = '';
            const orgCode = this.baseInfoForm.userOrgCode;
            if (orgCode) {
              const org = this.orgs.find((o) => o.orgCode === orgCode);
              if (org) {
                orgName = org.orgName;
              }
            }
            this.setConfirmInfo({ orgName });
            this.step += 1;
          });
          break;
        case 1:
          if (Object.values(this.roleList).length === 0) {
            this.$message.error('请选择岗位！');
            return;
          }
          this.setConfirmInfo({ ...this.baseInfoForm, roleList: this.roleList });
          this.step += 1;
          break;
        default:
          break;
      }
    },
    changeSelectedRoles(keys, records) {
      const oldRoleList = { ...this.roleList };
      const oldSelectedKey = Object.keys(oldRoleList);
      // 当前页要删除的 key
      const keysTodelete = oldSelectedKey.filter((oldKey) => keys.indexOf(oldKey) === -1);
      // 当前页要增加的记录
      const mapToAdd = keys.reduce((result, key) => {
        if (oldSelectedKey.indexOf(key) === -1) {
          const rowRecord = records.find((row) => row.roleCode === key);
          result[key] = rowRecord.roleName;
        }
        return result;
      }, {});

      // 计算最终选中的岗位列表
      keysTodelete.forEach((k) => delete oldRoleList[k]);
      Object.assign(oldRoleList, mapToAdd);

      this.roleList = oldRoleList;
    },
    setConfirmInfo(data) {
      Object.assign(this.confirmInfo, data);
    },
  },
  watch: {
    isCreateVisible(val, oldVal) {
      if (val && !oldVal) {
        if (val === 'edit') {
          for (let k in this.baseInfoForm) {
            if (Object.prototype.hasOwnProperty.call(this.baseInfoForm, k)) {
              this.baseInfoForm[k] = this.currUserDetail[k] || '';
            }
          }
          this.roleList = { ...(this.currUserDetail.roleList || {}) };
        }

        this.$store.dispatch({
          type: 'org/getAllOrg',
          payload: {
            orgSt: '1', // 此时用于获取所有状态为有效的岗位
          },
          callback: (data) => {
            if (Array.isArray(data) && data.length > 0) {
              this.orgs = data;
            }
          },
        });
      }
    },
  },
};
</script>

<style lang="scss" module>
.userModal {
  .content {
    margin-top: 0.24rem;
  }
}
</style>
