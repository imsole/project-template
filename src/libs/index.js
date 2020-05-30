import Vue from 'vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import * as utils from './utils';

// 全局api
import '../api/index';

Vue.use(ElementUI, { size: 'small' });

// utils
Object.defineProperty(Vue.prototype, '$util', {
    get() {
        return utils;
    },
});
