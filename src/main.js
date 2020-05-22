import Vue from 'vue'
import App from './App.vue'
import router from './router/';
import store from './store';
import './assets/css/common.scss'

// 插件、自己封装的工具方法、http
import './libs'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
