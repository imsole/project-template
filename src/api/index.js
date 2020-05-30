import { common } from './common';

export const HTTP = {
    common,
};

Object.defineProperty(Vue.prototype, '$http', {
    get() {
        return HTTP;
    },
});
