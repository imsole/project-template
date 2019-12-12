const home = {
  path: '/home',
  component: () => import('@/views/Home.vue'),
  meta: { id: 0 },
  children: [
    {
      path: '/home',
      redirect: '/home/dashboard'
    },
    {
      path: '/home/dashboard',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue')
    }
  ]
};

export default home;
