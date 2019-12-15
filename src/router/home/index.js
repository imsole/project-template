const home = {
  path: '/home',
  component: () => import('@/pages/Home.vue'),
  meta: { id: 0 },
  children: [
    {
      path: '/home',
      redirect: '/home/dashboard'
    },
    {
      path: '/home/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/Dashboard.vue')
    }
  ]
};

export default home;
