// 后端的 API接口

export default {
  login: '/mngLogin',
  getUserInfo: '/mngLogin/user/info',
  getUserMenu: '/mngLogin/user/menu',

  /***********  机构管理  ************/
  // 获取当前机构的直属下级机构列表
  getOrgListByLevel: '/orgMng/query',
  // 获取所有机构的树形拓扑图
  getOrgTree: '/orgMng/query/tree',
  getOrgDetail: '/orgMng/query/one',
  addOrg: '/orgMng/add',
  updateOrgDetail: '/orgMng/update',
  toggleOrgValidStatus: '/orgMng/isValid',
  getAllOrg: '/orgMng/get/all',

  /***********  岗位管理  ************/
  getRoleList: '/roleMng/query',
  // 根据岗位查询对应的用户列表
  getUserByRole: '/roleMng/queryUser',
  addRole: '/roleMng/add',
  updateRolePermissions: '/roleMng/setAccess',
  toggleRoleValidStatus: '/roleMng/update',
  getRoleDetail: '/roleMng/get/one',

  /***********  用户管理  ************/
  getUserList: '/userMng/query',
  addUser: '/userMng/add',
  deleteUser: '/userMng/delete',
  updateUserStatus: '/userMng/statusUpdate',
  updateUserDetail: '/userMng/update',
  getUserDetail: '/userMng/get/one',

  /***********  数据字典  ************/
  getDicList: '/dataDic/getPage',
  addDic: '/dataDic/addData',
  deleteDic: '/dataDic/deleteData',
  updateDic: '/dataDic/updateData',
  getDicDataDetail: '/dataDic/getDataById',
  // 登录后调用此接口，获取字典列表
  getDicLUT: '/dataDic/init',

  /************  菜单管理  ************/
  getMenuTree: '/menuMng/query/tree',
  addMenu: '/menuMng/add',
  deleteMenu: '/menuMng/delete',
  updateMenu: '/menuMng/update',

  /************  系统参数设置 ***********/
  getParamList: '/sysParam/getPage',
  updateParam: '/sysParam/updateData',

  /************* 系统日志查询 ***********/
  getSyslogList: '/sysBizLog/getPage',

  /************* 用户登录日志查询 ***********/
  getLoginlogList: '/sysLoginLog/getLogPage',
  getLoginDetailList: '/sysLoginLog/getDetailPage',

  /************* 个人设置 **************/
  getPersonalSettings: '/userMng/user/detail',
  setPersonalSettings: '/userMng/detail/update',
  updatePassword: '/userMng/password/update',
};
