import Vue from 'vue';

// ElementUI
import ElementUI from 'element-ui';
import '../assets/css/element-variables.scss'

import * as utils from './utils';

// 全局api
import '../api/index';

// 全局api
import '../api/index'

// 全局公共组件
import '../components/index'

// 注册 elementUI
Vue.use(ElementUI, { size: 'small' });

// utils
Object.defineProperty(Vue.prototype, '$util', {
    get() {
        return utils;
    },
});
