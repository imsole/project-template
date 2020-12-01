import Vue from 'vue';
import axios from 'axios';
import $router from '../router';
import { Loading, Notification } from 'element-ui';

let loading = null;
let notify = null;
let requestCount = 0;

/** 创建axios实例*/
const service = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 10000,
    token: true,
});

/** request拦截器，对请求参数做处理*/
service.interceptors.request.use(
    (config) => {
        requestCount++;
        loadingShow();

        // set header Content-Type
        if (config.method === 'get' || config.method === 'delete') {
            config.headers['Content-Type'] =
                'application/x-www-form-urlencoded';
        } else {
            config.headers['Content-Type'] = 'application/json';
        }

        // set header token
        // var token = Store.get('token') || '';
        // // token 根据这个参数判断是否需要添加token
        // if (config.token) {
        //     config.headers['Authorization'] = 'Bearer ' + token;
        // }

        return config;
    },
    (error) => {
        loadingHide();
        // eslint-disable-next-line no-console
        console.log(error);
    }
);

/** respone拦截器，对响应做处理*/
service.interceptors.response.use(
    (response) => {
        requestCount--;

        if (requestCount <= 0) {
            loadingHide();
        }

        return response.data;
    },
    (error) => {
        let res = error.response;
        let title = '异常';
        let msg = '';

        // 如果有返回的数据
        if (res) {
            if (![200,304].includes(res.status)) {
                msg = error.message;
            }
        } else {
            if (error.code === 'ECONNABORTED') {
                msg = '请求超时，请刷新页面重试。';
            } else {
                msg = '系统异常，错误码: ' + (res ? res.status : error.message);
            }
        }

        messageShow(title, msg);
        loadingHide();

        // if (res && res.data) {
        //     let code = res.data.code;
        //     // 未登录状态跳转到登录
        //     if (code === 'E10000') {
        //         Vue.prototype.$utils.delCookie('adminInfo');
        //         $router.push('/');
        //     }
        //     // 无权限
        //     if (code === 'E10001') {
        //         $router.push('/nopower');
        //     }
        // }
        // Do something with response error
        return Promise.reject(error);
    }
);

// 错误消息显示
function messageShow(title = '错误', msg) {
    if (notify) {
        return;
    }
    notify = Notification.error({
        title: title,
        message: msg,
        onClose() {
            notify = null;
        },
    });
}

function loadingShow() {
    if (loading) {
        return;
    }
    loading = Loading.service({ fullscreen: true });
}

function loadingHide() {
    if (!loading) {
        return;
    }
    requestCount = 0;
    loading.close();
    loading = null;
}

/** 发送请求*/
const fetch = async (options) => {
    let defConfig = {
        method: 'post',
        token: true,
    };

    let config = Object.assign(defConfig, options);

    // 处理 url '/news/{newsId}'
    if (/\{(\w+)\}/.test(config.url)) {
        var res = config.url.match(/\{(\w+)\}/);

        config.url = config.url.replace(/\{(\w+)\}/, config.data[res[1]]);
        delete config.data[res[1]];
    }

    if (['get', 'delete'].includes(config.method.toLowerCase())) {
        config.params = config.data;
    }

    return service(config);
};

export default fetch;
