import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 后台管理员信息
    adminInfo: {
      userName: null
    },
    // 右侧主页面的面包屑 和 面包屑下面的title
    pageNav: [],
    // home/dashboard 的菜单索引
    headerMenuIndex: null,
    // 线上展位讲师时间池
    teacherTimeList: []
  },
  mutations: {
    setAdminInfo(state, payload) {
      state.adminInfo = payload;
      // 存一下session，防止刷新丢失
      sessionStorage.setItem('adminInfo', JSON.stringify(payload));
    },
    delAdminInfo(state) {
      state.adminInfo = {};
      // 管理员信息 adminInfo
      // 权限菜单 'newRouter'
      // 总菜单 'menus'
      // 左侧菜单 'menusLeft'
      // 左侧选中菜单 'activeMenu'
      // 面包屑 pageNav
      let removeItems = [
        'adminInfo',
        'newRouter',
        'menus',
        'menusLeft',
        'activeMenu',
        'pageNav'
      ];
      removeItems.forEach(item => {
        sessionStorage.removeItem(item);
      });
      sessionStorage.setItem('headerMenuIndex', '0');
    },
    setPageNav(state, payload) {
      state.pageNav = payload;
      // 存一下cookie，防止刷新丢失
      sessionStorage.setItem('pageNav', JSON.stringify(payload));
    },
    delPageNav(state) {
      state.pageNav = [];
      // 删除cookie
      sessionStorage.removeItem('pageNav');
    },

    setHeaderMenuIndex(state, payload) {
      state.headerMenuIndex = payload + '';
      sessionStorage.setItem('headerMenuIndex', JSON.stringify(payload));
    },
    delHeaderMenuIndex(state) {
      state.headerMenuIndex = '0';
      // 删除
      sessionStorage.removeItem('headerMenuIndex');
    },
    updateTeacherTimeList(state, payload) {
      state.teacherTimeList = payload;
    }
  },
  getters: {
    getPageNav(state) {
      let resCookie = JSON.parse(sessionStorage.getItem('pageNav'));
      return state.pageNav.length ? state.pageNav : resCookie;
    },
    getHeaderMenuIndex(state) {
      let resIndex = JSON.parse(sessionStorage.getItem('headerMenuIndex'));
      return state.headerMenuIndex || resIndex;
    },
    getTeacherTiemList(state) {
      return state.teacherTimeList;
    }
  },
  actions: {
    setAdminInfo({ commit }, payload) {
      commit('setAdminInfo', payload);
    },
    delAdminInfo({ commit }) {
      commit('delAdminInfo');
    },

    setPageNav({ commit }, payload) {
      commit('setPageNav', payload);
    },
    delPageNav({ commit }) {
      commit('delPageNav');
    },

    setHeaderMenuIndex({ commit }, payload) {
      commit('setHeaderMenuIndex', payload);
    },
    delHeaderMenuIndex({ commit }) {
      commit('delHeaderMenuIndex');
    }
  }
});
