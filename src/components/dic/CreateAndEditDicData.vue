<template>
  <a-modal
    :title="isEdit ? '修改字典数据' : '新增字典数据'"
    :visible="!!isCreateDicDataVisible"
    @cancel="handleCancel"
    @ok="handleOk"
    :maskClosable="false"
    destroy-on-close
    :cancel-button-props="{ props: { disabled: isCreateDicDataLoading } }"
    :confirmLoading="isCreateDicDataLoading"
  >
    <a-form-model
      ref="dicDataForm"
      :model="form"
      :rules="rules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-form-model-item label="字典类型名称">
        <div>{{ currDicData.dicTypeName }}</div>
      </a-form-model-item>
      <a-form-model-item prop="dicCode" label="字典码">
        <a-input v-model="form.dicCode" :disabled="isEdit" />
      </a-form-model-item>
      <a-form-model-item prop="dicName" label="字典名称">
        <a-input v-model="form.dicName" />
      </a-form-model-item>
      <a-form-model-item prop="dicSeq" label="字典序号">
        <a-input v-model="form.dicSeq" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { mapState } from 'vuex';
import { dicGroupRules } from '@/constants/rules';
export default {
  name: 'CreateDicData',
  props: ['onCreateDicDataSuccess'],
  data() {
    return {
      form: {
        dicCode: '',
        dicName: '',
        dicSeq: '',
      },
      rules: dicGroupRules,
    };
  },
  computed: {
    ...mapState('dic', {
      isCreateDicDataVisible: 'isCreateDicDataVisible',
      isCreateDicDataLoading: 'isCreateDicDataLoading',
      currDicData: 'currDicData',
      isEdit: (state) => state.isCreateDicDataVisible === 'edit',
    }),
  },
  methods: {
    handleCancel() {
      this.$store.commit('dic/SET_STATE', { isCreateDicDataVisible: false, currDicData: {} });
      this.$refs.dicDataForm.resetFields();
    },
    handleOk() {
      this.$refs.dicDataForm.validate((valid) => {
        if (!valid) {
          return false;
        }
        const { dicId, dicTypeCode, dicTypeName } = this.currDicData;
        const dicSeq = this.form.dicSeq ? parseInt(this.form.dicSeq) : 0;
        if (this.isEdit) {
          const dicData = {
            dicId,
            dicName: this.form.dicName,
            dicSeq,
          };
          this.$store.dispatch({
            type: 'dic/editDicData',
            payload: dicData,
            callback: () => {
              this.handleCancel();
              this.$store.commit('dic/UPDATE_DIC_DATA', {
                dicTypeCode,
                dicData,
              });
            },
          });
        } else {
          this.$store.dispatch({
            type: 'dic/createDicGroup',
            payload: {
              dicTypeCode,
              dicTypeName,
              dicData: [{ ...this.form, dicSeq }],
            },
            callback: () => {
              this.handleCancel();
              if (typeof this.onCreateDicDataSuccess === 'function') {
                this.onCreateDicDataSuccess();
              }
            },
          });
        }
      });
    },
  },
  watch: {
    isCreateDicDataVisible(val, oldVal) {
      if (val && !oldVal) {
        for (const k in this.form) {
          if (Object.prototype.hasOwnProperty.call(this.form, k)) {
            this.form[k] = val === 'edit' ? this.currDicData[k] : '';
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" module></style>
