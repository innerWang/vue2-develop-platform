<template>
  <a-modal
    :title="isCreateVisible === 'edit' ? '修改菜单详情' : '新增菜单'"
    :visible="!!isCreateVisible"
    @cancel="handleCancel"
    @ok="handleOk"
    :maskClosable="false"
    destroy-on-close
    :cancel-button-props="{ props: { disabled: isCreateLoading } }"
    :confirmLoading="isCreateLoading"
  >
    <a-form-model
      ref="menuForm"
      :model="form"
      :rules="rules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-form-model-item label="上级菜单" prop="menuUpCode">
        <a-tree-select
          v-model="form.menuUpCode"
          :tree-data="classifiedMenu.dirs"
          allow-clear
          :replaceFields="{ title: 'menuName', key: 'menuCode', value: 'menuCode' }"
          @change="handleChangeUpMenu"
        />
      </a-form-model-item>
      <a-form-model-item label="菜单类型" prop="menuType">
        <a-radio-group v-model="form.menuType">
          <a-radio v-for="option in MENU_TYPE_OPTIONS" :key="option.key" :value="option.key">
            {{ option.value }}
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="菜单名称" prop="menuName">
        <a-input v-model="form.menuName" />
      </a-form-model-item>
      <template v-if="this.isUpMenuDir">
        <template v-if="form.menuType === '2'">
          <a-form-model-item label="路由地址" prop="menuPath">
            <a-input v-model="form.menuPath" />
          </a-form-model-item>
          <a-form-model-item label="路由名称" prop="componentName">
            <a-input v-model="form.componentName" />
          </a-form-model-item>
        </template>
        <a-form-model-item label="菜单图标" prop="menuIcon">
          <a-input v-model="form.menuIcon" />
        </a-form-model-item>
      </template>
      <template v-else>
        <a-form-model-item label="权限标识" prop="funcSign">
          <a-input v-model="form.funcSign" />
        </a-form-model-item>
      </template>
      <a-form-model-item label="显示顺序" prop="menuSeq">
        <a-input v-model="form.menuSeq" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { formatDicToArray } from '@/utils/helpers';
import { menuRules } from '@/constants/rules';
export default {
  name: 'CreateOrEditMenu',
  props: ['onSuccess'],
  data() {
    return {
      // 默认上级菜单是目录，此时可新建目录或菜单，但是上级若为菜单，则只能新建按钮
      isUpMenuDir: true,
      form: {
        menuUpCode: '',
        menuType: '',
        menuPath: '',
        menuName: '',
        menuIcon: '',
        menuSeq: '',
        componentName: '',
        funcSign: '',
        menuCode: '',
      },
      rules: menuRules,
    };
  },
  computed: {
    ...mapState('menu', ['isCreateVisible', 'isCreateLoading', 'currMenu']),
    ...mapGetters('menu', ['classifiedMenu']),
    MENU_TYPE_OPTIONS() {
      const menu_map = { ...(this.$store.state.dic.dicLUT.D103 || {}) };
      let ret = {};

      if (Object.keys(menu_map).length > 0) {
        // 目录 -- 1， 菜单 -- 2， 功能 -- 3
        if (this.isUpMenuDir) {
          delete menu_map['3'];
          ret = menu_map;
        } else {
          ret = { '3': menu_map['3'] };
        }
      }

      return formatDicToArray(ret);
    },
  },
  watch: {
    isCreateVisible(val, oldVal) {
      if (val && !oldVal) {
        for (const k in this.form) {
          if (Object.prototype.hasOwnProperty.call(this.form, k)) {
            this.form[k] = this.currMenu[k] || '';
            const { menuUpType, menuType } = this.currMenu;
            if (menuUpType) {
              // 知道上级菜单类型
              this.isUpMenuDir = menuUpType === '1';
            } else if (menuType) {
              // 知道当前菜单类型
              this.isUpMenuDir = menuType !== '3';
            }
          }
        }
      }
    },
  },
  methods: {
    handleChangeUpMenu(val, label, extra) {
      const selectedNodeChildrenLength = extra.triggerNode.$children.length;
      this.isUpMenuDir = selectedNodeChildrenLength !== 0;
    },
    handleCancel() {
      // 这里也可以不 reset，因为打开模态窗时都会赋值
      //this.$refs.menuForm.resetFields();
      this.$store.commit('menu/SET_FIELD', { field: 'isCreateVisible', value: false });
    },
    handleOk() {
      const formRef = this.$refs.menuForm;
      formRef.validate((valid) => {
        if (!valid) {
          return false;
        }

        const {
          menuType,
          menuUpCode,
          menuPath,
          menuName,
          menuIcon,
          menuSeq,
          componentName,
          funcSign,
          menuCode,
        } = this.form;
        const data = { menuUpCode, menuType, menuName, menuSeq: menuSeq ? parseInt(menuSeq) : 0 };
        if (menuType === '1') {
          Object.assign(data, { menuIcon });
        } else if (menuType === '2') {
          Object.assign(data, { menuIcon, componentName, menuPath });
        } else if (menuType === '3') {
          Object.assign(data, { funcSign });
        }
        menuCode && Object.assign(data, { menuCode });
        this.$store.dispatch({
          type: 'menu/addMenu',
          payload: data,
          callback: () => {
            this.handleCancel();
            // 新建和修改成功都需要重新去获取列表
            if (typeof this.onSuccess === 'function') {
              this.onSuccess();
            }
          },
        });
      });
    },
  },
};
</script>

<style lang="scss" module></style>
