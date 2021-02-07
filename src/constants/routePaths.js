// 路由配置
export default {
  root: '/',
  login: '/login',
  changeInitialPassword: '/changeinitialpassword',
  exportTasks: '/export',
  dashboard: '/dashboard',
  permission: {
    index: '/permission',
    org: '/permission/org',
    role: '/permission/role',
    user: '/permission/user',
  },
  config: {
    index: '/config',
    dic: '/config/dict',
    menu: '/config/menu',
    param: '/config/param',
  },
  query: {
    index: '/query',
    syslog: '/query/syslog',
    loginlog: '/query/loginlog',
  },
  account: {
    index: '/account',
    settings: {
      index: '/account/settings',
      base: '/account/settings/base',
      security: '/account/settings/security',
    },
  },
  exception: {
    page404: '/404',
  },
};
