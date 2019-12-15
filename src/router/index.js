import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Router Modules */
import home from './home/';

/**
 * constantRoutes
 * 静态路由
 */
export const constantRoutes = [
  home,
  {
    path: '/404',
    name: 'Error404',
    component: () => import('@/pages/status/Error404.vue')
  },
  {
    path: '/500',
    name: 'Error500',
    component: () => import('@/pages/status/Error500.vue')
  },
  {
    path: '/403',
    name: 'Error403',
    component: () => import('@/pages/status/Error403.vue')
  },
  {
    path: '/',
    name: 'login',
    component: () => import('@/pages/status/Login.vue')
  },
  { path: '*', redirect: '/404' }
];

/**
 * asyncRoutes
 * 动态路由, 根据权限判断是否存在此路由
 */
export const asyncRoutes = [];

/**
 * 创建路由
 */
const createRouter = () =>
  new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes.concat(asyncRoutes)
  });

const router = createRouter();

/**
 * 重置路由
 */
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

/**
 * 重置并添加当前用户的权限路由
 */
router.$addRoutes = params => {
  resetRouter();
  router.addRoutes(params);
};

/**
 * 解决同一个菜单重复点击报错问题
 */
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};

export default router;
