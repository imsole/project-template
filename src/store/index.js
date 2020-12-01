import Vue from 'vue';
import Vuex from 'vuex';

import adminInfo from './modules/adminInfo'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    adminInfo
  }
});