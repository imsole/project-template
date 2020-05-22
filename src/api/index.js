import Vue from 'vue';

const HTTP = {};
const files = require.context('./', false, /\.js$/);

files.keys().forEach(fileName => {
    const componentConfig = files(fileName);
    const componentName = fileName.substring(2).replace(/\.\w+$/, '');
    if (componentName !== 'index') {
        HTTP[componentName] = componentConfig.default;
    }
});

Object.defineProperty(Vue.prototype, '$http', {
    get() { return HTTP }
});