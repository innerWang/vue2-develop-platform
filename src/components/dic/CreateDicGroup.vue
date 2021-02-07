<template>
  <a-modal
    title="新增字典类型"
    :visible="isCreateDicGroupVisible"
    @cancel="handleCancel"
    @ok="handleOk"
    :maskClosable="false"
    destroy-on-close
    :cancel-button-props="{ props: { disabled: isCreateDicGroupLoading } }"
    :confirmLoading="isCreateDicGroupLoading"
    :wrapClassName="$style.createDicGroupModal"
    :width="700"
  >
    <div :class="$style.content">
      <a-form v-bind="formItemLayout" :form="form">
        <a-form-item label="字典类型编号">
          <a-input v-decorator="['dicTypeCode', { rules: dicGroupRules.dicTypeCode }]" />
        </a-form-item>
        <a-form-item label="字典类型名称">
          <a-input v-decorator="['dicTypeName', { rules: dicGroupRules.dicTypeName }]" />
        </a-form-item>
        <a-form-item
          v-for="(k, index) in form.getFieldValue('dicDataKeys')"
          :key="k"
          v-bind="index === 0 ? formItemLayout : formItemLayoutWithoutLabel"
          :label="index === 0 ? '字典数据' : ''"
          :required="index === 0"
        >
          <a-row :gutter="10">
            <a-col span="7">
              <a-form-item>
                <a-input
                  v-decorator="[
                    `dicCodes[${k}]`,
                    { rules: dicGroupRules.dicCode.concat({ validator: checkRepeatDicCode }) },
                  ]"
                  placeholder="字典码值"
                />
              </a-form-item>
            </a-col>
            <a-col span="7">
              <a-form-item>
                <a-input
                  v-decorator="[`dicNames[${k}]`, { rules: dicGroupRules.dicName }]"
                  placeholder="字典名称"
                />
              </a-form-item>
            </a-col>
            <a-col span="7">
              <a-form-item>
                <a-input
                  v-decorator="[`dicSeqs[${k}]`, { rules: dicGroupRules.dicSeq }]"
                  placeholder="字典序号"
                />
              </a-form-item>
            </a-col>
            <a-col span="2" v-if="index !== 0">
              <span @click="removeDicData(k)" :class="$style.dangerBtn">
                <a-icon type="delete" />
              </span>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item v-bind="formItemLayoutWithoutLabel">
          <a-button type="dashed" style="width: 60%" @click="addDicData">
            <a-icon type="plus" />添加字典数据
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
import { mapState } from 'vuex';
import { dicGroupRules } from '@/constants/rules';
export default {
  name: 'CreateDicGroup',
  props: ['onCreateSuccess'],
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 18 },
      },
      formItemLayoutWithoutLabel: {
        wrapperCol: { span: 18, offset: 5 },
      },
      dicGroupRules,
      dicDataId: 0,
    };
  },
  computed: {
    ...mapState('dic', ['isCreateDicGroupVisible', 'isCreateDicGroupLoading']),
  },
  methods: {
    handleCancel() {
      this.$store.commit('dic/SET_FIELD', { field: 'isCreateDicGroupVisible', value: false });
      this.form.resetFields();
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const { dicDataKeys, dicCodes, dicNames, dicTypeCode, dicTypeName, dicSeqs } = values;
          const dicData = dicDataKeys.map((k) => ({
            dicCode: dicCodes[k],
            dicName: dicNames[k],
            dicSeq: dicSeqs[k] ? parseInt(dicSeqs[k]) : 0,
          }));
          this.$store.dispatch({
            type: 'dic/createDicGroup',
            payload: {
              dicData,
              dicTypeCode,
              dicTypeName,
            },
            callback: () => {
              this.handleCancel();
              if (typeof this.onCreateSuccess === 'function') {
                this.onCreateSuccess();
              }
            },
          });
        }
      });
    },
    addDicData() {
      const { form } = this;
      const keys = form.getFieldValue('dicDataKeys');
      this.dicDataId += 1;
      const nextKeys = keys.concat(this.dicDataId);
      form.setFieldsValue({
        dicDataKeys: nextKeys,
      });
    },
    removeDicData(k) {
      const { form } = this;
      const keys = form.getFieldValue('dicDataKeys');
      if (keys.length === 1) {
        return;
      }
      form.setFieldsValue({
        dicDataKeys: keys.filter((key) => key !== k),
      });
    },
    checkRepeatDicCode(rule, value, callback) {
      const dicCodeArray = this.form.getFieldValue('dicCodes');
      if (value && Array.isArray(dicCodeArray)) {
        const filtered = dicCodeArray.filter((code) => code === value);
        if (filtered.length > 1) {
          callback('重复的字典码值');
        }
      }
      callback();
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'dynamicForm' });
    this.form.getFieldDecorator('dicDataKeys', { initialValue: [0], preserve: true });
  },
};
</script>

<style lang="scss" module>
.createDicGroupModal {
  .dangerBtn {
    color: #e23b43;
    cursor: pointer;

    &:hover {
      color: #f00;
    }
  }

  :global {
    .ant-form {
      > .ant-form-item {
        &:nth-child(n + 3) {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
