import Vue from 'vue'

// ElementUI
import ElementUI from 'element-ui';
import '../assets/css/element-variables.scss'

// 自定义工具
import * as utils from './utils';

// 全局api
import '../api/index'

// 全局公共组件
import '../components/index'

// 注册 elementUI
Vue.use(ElementUI, { size: 'small' });

// 注册 utils
Object.defineProperty(Vue.prototype, '$utils', {
    get() { return utils }
});