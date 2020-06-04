import Vue from 'vue';

const HTTP = {};
const files = require.context('./', false, /\.js$/);

files.keys().forEach((fileName) => {
    const apiConfig = files(fileName);
    const apiName = fileName.substring(2).replace(/\.\w+$/, '');
    if (apiName !== 'index') {
        HTTP[apiName] = apiConfig.default;
    }
});

Object.defineProperty(Vue.prototype, '$http', {
    get() {
        return HTTP;
    },
});
