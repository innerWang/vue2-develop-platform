// 机构管理
export const orgRules = {
  orgNo: [
    { required: true, message: '请输入机构代码' },
    { pattern: /^[1-9]\d{0,31}$/, message: '1-32，仅支持数字，不能以0开头' },
  ],
  orgName: [
    { required: true, message: '请输入机构名称' },
    { pattern: /^[\u4e00-\u9fa5\da-zA-Z]{1,50}$/, message: '1-50，可含中文、字母、数字' },
  ],
  orgLvl: [{ required: true, message: '请选择机构级别' }],
  orgUpCode: [{ required: true, message: '请选择上级机构' }],
  orgMngCode: [{ required: true, message: '请选择账务机构' }],
  orgPostno: [{ pattern: /^[1-9]\d{5}$/, message: '请输入正确的邮政编码' }],
  orgAddr: [{ pattern: /^[\u4e00-\u9fa5\da-zA-Z]{1,50}$/, message: '1-50，可含中文、字母、数字' }],
};

// 岗位管理
export const roleRules = {
  roleName: [
    { required: true, message: '请输入岗位名称' },
    { pattern: /^[\u4e00-\u9fa5\da-zA-Z]{1,30}$/, message: '1-30，可含中文、字母、数字' },
  ],
};

// 用户管理

export const userRules = {
  userNo: [
    { required: true, message: '请输入用户工号' },
    { pattern: /^[\da-z]{1,20}$/, message: '1-20, 可含小写字母、数字' },
  ],
  userName: [
    { required: true, message: '请输入用户名称' },
    { pattern: /^[\u4e00-\u9fa5\da-zA-Z]{1,30}$/, message: '1-30, 可含中文、字母、数字' },
  ],
  userOrgCode: [{ required: true, message: '请选择用户所属机构' }],
};

// 字典管理

export const dicGroupRules = {
  dicTypeCode: [
    { required: true, message: '请输入字典类型编号' },
    { pattern: /^[\da-zA-Z]{1,20}$/, message: '1-20, 可含大小写字母、数字' },
  ],
  dicTypeName: [
    { required: true, message: '请输入字典类型名称' },
    { pattern: /^[\u4e00-\u9fa5\da-zA-Z]{1,30}$/, message: '1-30, 可含中文、字母、数字' },
  ],
  dicCode: [
    { required: true, message: '请输入字典码值' },
    { pattern: /^\d{1,10}$/, message: '1-10，仅含数字' },
  ],
  dicName: [
    { required: true, message: '请输入字典名称' },
    { pattern: /^\S{1,30}$/, message: '1-30，不含空白字符' },
  ],
  dicSeq: [{ pattern: /^(0|[1-9]\d{0,9})$/, message: '1-10, 需为有效的序号' }],
};

// 系统参数管理
export const paramRules = {
  parmCode: [{ required: true, message: '请输入参数名称' }],
  parmValue: [
    { required: true, message: '请设置参数值' },
    { pattern: /^\S{1,30}$/, message: '1-30，不含空白字符' },
  ],
};

// 个人中心 --- 基本设置
export const userBaseSettingRules = {
  email: [{ type: 'email', message: '请输入合法的电子邮箱' }],
};

export const passwordRules = {
  password: [
    { required: true, message: '请输入当前密码' },
    { pattern: /^[\w]{6,30}$/, message: '6-30，含字母、数字、下划线' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码' },
    { pattern: /^[\w]{6,30}$/, message: '6-30，含字母、数字、下划线' },
  ],
  confirmPassword: [{ required: true, message: '请输入确认新密码' }],
};

export const menuRules = {
  menuUpCode: [{ required: true, message: '请选择上级菜单' }],
  menuType: [{ required: true, message: '请选择菜单类型' }],
  menuPath: [{ required: true, message: '请输入路由地址' }],
  menuName: [
    { required: true, message: '请输入菜单名称' },
    { pattern: /^[\u4e00-\u9fa5\da-zA-Z]{1,10}$/, message: '1-10, 可含中文、字母、数字' },
  ],
  menuSeq: [{ pattern: /^(0|[1-9]\d{0,9})$/, message: '1-10, 需为有效的序号' }],
  componentName: [
    { required: true, message: '请输入路由名称' },
    { pattern: /^[\da-zA-Z]{1,30}$/, message: '1-30, 可含字母、数字' },
  ],
  funcSign: [{ required: true, message: '请输入权限标识' }],
};
