<template>
  <a-modal
    :title="isCreateVisible === 'edit' ? '编辑岗位' : '新增岗位'"
    :visible="!!isCreateVisible"
    @cancel="handleCancel"
    @ok="handleOk"
    :maskClosable="false"
    destroy-on-close
    :cancel-button-props="{ props: { disabled: createLoading } }"
    :confirmLoading="createLoading"
    :wrapClassName="$style.createRoleModal"
  >
    <div :class="$style.contentWrapper">
      <a-form-model :model="form" :rules="rules" ref="roleForm" labelAlign="left">
        <a-form-model-item
          ref="roleName"
          prop="roleName"
          label="岗位名称"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-input v-model="form.roleName" />
        </a-form-model-item>
      </a-form-model>
      <a-tree
        :checkedKeys="checkedKeys"
        checkable
        default-expand-all
        :tree-data="menuTreeWithRoot"
        :replaceFields="{ title: 'menuName', key: 'menuCode' }"
        :selectable="false"
        @check="handleCheckChange"
      />
    </div>
  </a-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { roleRules } from '@/constants/rules';

export default {
  name: 'CreateRole',
  props: {
    onSuccess: {
      type: Function,
      default: () => {},
    },
  },
  data: function() {
    return {
      form: {
        roleName: '',
        roleCode: '',
      },
      checkedKeys: [],
      halfCheckedKeys: [],
      rules: roleRules,
    };
  },
  computed: {
    ...mapState('role', ['createLoading', 'isCreateVisible', 'currRoleDetail']),
    ...mapGetters('menu', ['menuTreeWithRoot', 'classifiedMenu']),
  },
  watch: {
    isCreateVisible(val, oldVal) {
      if (val && !oldVal) {
        console.log(this.currRoleDetail);
        for (const k in this.form) {
          if (Object.prototype.hasOwnProperty.call(this.form, k)) {
            this.form[k] = this.currRoleDetail[k] || '';
          }
        }
        // 进行反显计算
        const permissions = this.currRoleDetail.permissions || [];
        const { leafs } = this.classifiedMenu;
        const checkedLeafs = [];
        const halfCheckedKeys = [];
        permissions.forEach((p) => {
          if (leafs.indexOf(p) !== -1) {
            checkedLeafs.push(p);
          } else {
            halfCheckedKeys.push(p);
          }
        });
        this.checkedKeys = checkedLeafs;
        this.halfCheckedKeys = halfCheckedKeys;
      }
    },
  },
  methods: {
    handleCheckChange(checkedKeys, { halfCheckedKeys }) {
      this.checkedKeys = checkedKeys;
      this.halfCheckedKeys = halfCheckedKeys;
    },
    handleCancel() {
      this.$store.commit('role/SET_FIELD', { field: 'isCreateVisible', value: false });
      //this.$refs.roleForm.resetFields();
    },
    handleOk() {
      const formRef = this.$refs.roleForm;
      formRef.validate((valid) => {
        if (!valid) {
          return false;
        }
        const {
          form: { roleName, roleCode },
          checkedKeys,
          halfCheckedKeys,
        } = this;
        const permissions = checkedKeys
          .concat(halfCheckedKeys)
          .filter((p) => ['0'].indexOf(p) === -1);
        if (roleCode) {
          this.$store.dispatch({
            type: 'role/updateRolePermissions',
            payload: {
              roleCode,
              roleName,
              permissions,
            },
            callback: () => {
              this.handleCancel();
            },
          });
        } else {
          this.$store.dispatch({
            type: 'role/createRole',
            payload: {
              roleName,
              permissions,
            },
            callback: () => {
              this.handleCancel();
              this.onSuccess();
            },
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" module>
.createRoleModal {
  .contentWrapper {
    max-height: 4rem;
    overflow: scroll;
  }
}
</style>
