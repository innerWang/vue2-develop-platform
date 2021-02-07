import BasicLayout from '@/layouts/BasicLayout';
import routePaths from '@/constants/routePaths';
import { hasChildren } from '@/utils/helpers';

// 需要异步加载的路由组件映射关系
const asyncRouteComponents = {
  Org: () => import('@/views/syspermission/Org'),
  Role: () => import('@/views/syspermission/Role'),
  Users: () => import('@/views/syspermission/Users'),
  Dict: () => import('@/views/sysconfig/Dict'),
  Menu: () => import('@/views/sysconfig/Menu'),
  Param: () => import('@/views/sysconfig/Param'),
  SystemLog: () => import('@/views/sysquery/SystemLog'),
  LoginLog: () => import('@/views/sysquery/LoginLog'),
};

/**
 * route 对象配置：默认能点开的路由有 route.name 就会生成对应的 tags， 若route.name 与组件名称一致，则会 keepAlive
 *  * useChildAsRoot --- 将子路由覆盖当前路由，用于子路由只有一个的情况
 *  * name           --- 针对需要 keepAlive 的组件很必要，当 keep-alive 的规则是使用 includes时需要和组件的 name 一致
 *  * hidden         --- 在侧边栏导航中隐藏此路由
 *  * meta           --- 路由元信息
 *      * icon          --- 主要用于侧边栏 menu 对应的 icon 显示
 *      * title         --- 路由对应的标题，用于侧边栏导航，面包屑，tags
 *      * affix          --- 表示对应的 tags 是否需要固定
 *
 *
 */

// 不会出现到导航栏，也不受权限控制的页面路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: BasicLayout,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index'),
      },
    ],
  },
  {
    path: routePaths.login,
    component: () => import('@/views/login'),
  },
  {
    path: routePaths.changeInitialPassword,
    component: () => import('@/views/login/ChangeInitialPassword'),
  },
  {
    path: routePaths.exportTasks, // 批量导出任务列表
    component: () => import('@/views/ExportTasks'),
  },
  {
    path: routePaths.exception.page404,
    component: () => import('@/views/error-page/404'),
  },
  {
    path: routePaths.account.index,
    component: BasicLayout,
    redirect: routePaths.account.settings.index,
    children: [
      {
        path: routePaths.account.settings.index,
        component: () => import('@/views/account/Settings'),
        redirect: routePaths.account.settings.base,
        name: 'AccountSettings',
        meta: { title: '个人设置' },
        children: [
          {
            path: routePaths.account.settings.base,
            component: () => import('@/views/account/settings/BaseSetting'),
            name: 'AccountBaseSetting',
            meta: { title: '基本设置' },
          },
          {
            path: routePaths.account.settings.security,
            component: () => import('@/views/account/settings/ChangePwd'),
            name: 'AccountChangePwd',
            meta: { title: '修改密码' },
          },
        ],
      },
    ],
  },
];

const rootRoute = {
  path: routePaths.root,
  component: BasicLayout,
  redirect: routePaths.dashboard,
  children: [],
};

const homepageRoute = {
  path: routePaths.dashboard,
  component: () => import('@/views/dashboard'),
  name: 'Dashboard',
  meta: { icon: 'home', title: '主页', affix: true },
};

const notFoundRoute = {
  path: '*',
  redirect: '/404',
  hidden: true,
};

const DIR_MENU_TYPE = '1';
const PAGE_MENU_TYPE = '2';

const isEffectiveRoute = (route) => {
  if (route.menuType !== PAGE_MENU_TYPE) return false;
  const hasRequiredProperties = ['menuName', 'menuPath', 'componentName'].every(
    (k) => Object.prototype.hasOwnProperty.call(route, k) && route[k]
  );
  if (!hasRequiredProperties) return false;
  return true;
};

// 生成路由，铺平为一级，不使用redirect
export const generateDynamicRouter = (routerMap = []) => {
  const processor = (routes, item) => {
    if (hasChildren(item)) {
      routes = routes.concat(item.children.reduce(processor, []));
    } else if (isEffectiveRoute(item)) {
      try {
        const obj = {
          meta: { title: item.menuName, icon: item.menuIcon, key: item.menuCode },
          component: asyncRouteComponents[item.componentName],
          name: item.componentName,
          path: item.menuPath,
        };
        routes.push(obj);
      } catch (e) {
        console.error('加载菜单组件错误！');
        console.error(e.message);
      }
    }
    return routes;
  };

  const aRoutes = routerMap.reduce(processor, []);
  return [{ ...rootRoute, children: [homepageRoute, ...aRoutes] }, notFoundRoute];
};

const isEffectiveMenu = (m) => {
  if ([DIR_MENU_TYPE, PAGE_MENU_TYPE].indexOf(m.menuType) === -1) return false;
  if (!m.menuName || m.hidden) return false;
  return true;
};
// 生成菜单，仅含主页+动态路由
export const generateDynamicMenu = (routerMap = []) => {
  const processor = (menus, item) => {
    if (isEffectiveMenu(item)) {
      const m = {
        key: item.menuCode,
        meta: { icon: item.menuIcon, title: item.menuName },
        parentId: item.menuUpCode || '0',
      };
      if (hasChildren(item)) {
        m.children = item.children.reduce(processor, []);
      } else if (item.menuPath) {
        m.path = item.menuPath;
      }
      menus.push(m);
    }
    return menus;
  };

  const aMenu = routerMap.reduce(processor, []);
  return [
    {
      path: routePaths.dashboard,
      key: 'Dashboard',
      meta: { icon: 'home', title: '主页' },
      parentId: '0',
    },
    ...aMenu,
  ];
};

// 根据权限点生成菜单
export const filterRoutesByPermissions = (routes, permissions) => {
  // 没有传权限点或者权限点不是数组，默认返回所有
  if (!permissions || !Array.isArray(permissions)) {
    return routes;
  }
  return routes.reduce((ret, cur) => {
    if (cur.children) {
      const filtered = filterRoutesByPermissions(cur.children, permissions);
      if (filtered.length) {
        ret.push({ ...cur, children: filtered });
      }
    } else if (cur.meta && typeof cur.meta.permissionId !== 'undefined') {
      if (permissions.indexOf(cur.meta.permissionId) !== -1) {
        ret.push(cur);
      }
    } else {
      ret.push(cur);
    }

    return ret;
  }, []);
};

/**
 * 根据传入的路由生成对应的菜单
 * @param {*} routes
 */
export const generateMenuByRoutes = (routes) => {
  const menu = routes
    .filter((route) => !route.hidden)
    .map((route) => {
      if (route.children) {
        const submenu = generateMenuByRoutes(route.children);
        if (route.useChildAsRoot && submenu.length === 1) {
          return submenu[0];
        } else {
          return { path: route.path, meta: route.meta, children: submenu };
        }
      }
      return { path: route.path, meta: route.meta };
    });
  return menu;
};
