import Vue from 'vue'
import App from './App.vue'
import router from './router/';
import store from './store';
import * as utils from './libs/util';
import { HTTP } from './api'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI, { size: 'small' });

// utils
Vue.prototype.$util = utils;
Vue.prototype.$http = HTTP;

Vue.config.productionTip = false

new Vue({
  http: HTTP,
  store,
  router,
  render: h => h(App),
}).$mount('#app')
