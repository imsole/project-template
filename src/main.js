import Vue from 'vue'
import App from './App.vue'
import router from './router/';
import store from './store';
import { utils } from './config/util';
import * as api from './config/api'

// utils
Vue.prototype.$utils = utils;
Vue.prototype.$http = api;

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
