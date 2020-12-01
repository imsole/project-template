import Vue from 'vue';

const HTTP = {};
const files = require.context('./', true, /\.js$/);

// files.keys().forEach((fileName) => {
//     const apiConfig = files(fileName);
//     const apiName = fileName.substring(2).replace(/\.\w+$/, '');
//     if (apiName !== 'index') {
//         HTTP[apiName] = apiConfig.default;
//     }
// });

files.keys().forEach((fileName) => {
    const apiConfig = files(fileName);
    const apiName = fileName.substring(2).replace(/\.\w+$/, '');
	const arr = apiName.split('/')

	if(arr.length == 1) {
		if (arr[0] !== 'index') {
			HTTP[arr[0]] = apiConfig.default;
		}
	} else {
		if(arr[0] in HTTP) {
			HTTP[arr[0]][arr[1]] = apiConfig.default;
		} else {
			HTTP[arr[0]] = {};
			HTTP[arr[0]][arr[1]] = apiConfig.default;
		}
	}
});

Object.defineProperty(Vue.prototype, '$http', {
    get() {
        return HTTP;
    },
});
