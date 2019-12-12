import Vue from 'vue'
import axios from 'axios'
import $router from '@/route'
import { Loading } from 'element-ui';

let loading = null;
let notify = null;
let requestCount = 0;

/** 创建axios实例*/
const service = axios.create({
    baseURL: '',
    timeout: 10000,
    retry : 4,
    retryDelay : 500,
    authToken : true
});

/** request拦截器，对请求参数做处理*/
service.interceptors.request.use(config => {

    requestCount ++ ;
    loadingShow();

    // set header Content-Type
    if(config.method === 'get' || config.method === 'delete') {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }else{
        config.headers['Content-Type'] = 'application/json';
    }

    // set header token
    // var token = Store.get('token') || '';
    // // authToken 根据这个参数判断是否需要添加token
    // if (config.authToken) {
    //     config.headers['Authorization'] = 'Bearer ' + token;
    // }

    return config;
}, error => {
    loadingHide();
    // eslint-disable-next-line no-console
    console.log(error);
});

/** respone拦截器，对响应做处理*/
service.interceptors.response.use(response => {

    requestCount --;

    if (requestCount <= 0) {
        loadingHide();
    }

    return response.data;
}, error => {
    let res = error.response;
    let title = '异常';
    let msg = '';

    // 如果有返回的数据
    if (res && res.data) {
      msg = res.data.message;
    } else {
      if (error.code === 'ECONNABORTED') {
        msg = '请求超时，请刷新页面重试。';
      } else {
        msg = '系统异常，请联系管理员；错误码: ' + error.response.status;
      }
    }

    messageShow(title, msg);
    loadingHide();

    if (res && res.data) {
      let code = res.data.code;
      // 未登录状态跳转到登录
      if (code === 'E10000') {
        Vue.prototype.$utils.delCookie('adminInfo');
        $router.push('/');
      }
      // 无权限
      if (code === 'E10001') {
        $router.push('/nopower');
      }
    }
    // Do something with response error
    return Promise.reject(error);
});

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
      }
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
    loading.close()
    loading = null;
}

/** 发送请求*/
const fetch = async (url = '', data = {}, method = '', authToken = true) => {
    if (!method) { method = 'GET' }

    // 处理 url '/news/{newsId}'
    if (/\{(\w+)\}/.test(url)) {
        var res = url.match(/\{(\w+)\}/);
        url = url.replace(/\{(\w+)\}/, data[res[1]]);
        delete data[res[1]];
    }

    let args = { url, method, };

    if (method === 'GET' || method === 'DELETE') {
        args.params = data;
    }else{
        args.data = data;
    }

    args.authToken = authToken;

    return service(args);
}

export default fetch;