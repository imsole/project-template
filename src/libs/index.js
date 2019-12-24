import Vue from 'vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import * as utils from './libs/util';
import { HTTP } from './api'

Vue.use(ElementUI, { size: 'small' });

// utils
Object.defineProperty(Vue.prototype, '$util', {
  get(){ return utils }
});
Object.defineProperty(Vue.prototype, '$http', {
  get(){ return HTTP }
});