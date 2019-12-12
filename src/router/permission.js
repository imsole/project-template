import router from './';
import { constantRoutes, asyncRoutes } from './';

// 设置动态路由
function getAsyncRouter(sessionMenus) {
  let sessionRouter = sessionStorage.getItem('newRouter');
  if (sessionRouter) {
    return JSON.parse(sessionRouter);
  }
  let newRouter = [];
  constantRoutes.forEach(item => {
    if (item.children) {
      newRouter.push(...item.children);
    } else {
      newRouter.push(item);
    }
  });
  let menus = JSON.parse(sessionMenus);
  menus.forEach(menu => {
    asyncRoutes.forEach(route => {
      if (menu.id == route.meta.id) {
        newRouter.push(...route.children);
      }
    });
  });
  sessionStorage.setItem('newRouter', JSON.stringify(newRouter));
  return newRouter;
}

// 判断当前访问的路径是否存在权限路由里面
function hasRole(topath) {
  let menus = sessionStorage.getItem('menus');
  let asyncRouter = getAsyncRouter(menus);

  let res = asyncRouter.filter(item => {
    let itemLevel1 = item.path.split('/')[1];
    let topathLevel1 = topath.split('/')[1];
    return item.path == topath || itemLevel1 == topathLevel1;
  });
  return res.length > 0;
}

router.beforeEach(async (to, from, next) => {
  // 设置标题
  document.title = '标题';

  // adminInfo 存在，说明已经登录
  let isLogin = sessionStorage.getItem('adminInfo');

  if (isLogin) {
    if (to.fullPath === '/') {
      next('/home/dashboard');
    } else {
      let isRole = hasRole(to.fullPath);
      if (isRole) {
        next();
      } else {
        if (to.path === '/404') {
          next();
        } else {
          next('/404');
        }
      }
    }
  } else {
    if (to.path === '/') {
      next();
    } else {
      next('/');
    }
  }
});
