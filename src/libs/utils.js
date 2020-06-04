// 获取对象类型
export function getType(o) {
    return Object.prototype.toString
        .call(o)
        .slice(8, -1)
        .toLowerCase();
}

// sessionStorage 存储
export const SStore = {
    set: (key, val) => {
        if (getType(key) === 'object') {
            Object.keys(key).forEach((k) => {
                var v = JSON.stringify(key[k]);
                sessionStorage.setItem(k, v);
            });
        } else {
            var item = JSON.stringify(val);
            sessionStorage.setItem(key, item);
        }
    },
    get: (key) => {
        return sessionStorage.getItem(key)
            ? JSON.parse(sessionStorage.getItem(key))
            : false;
    },
    del: (key) => {
        let keys = [];
        keys = Array.isArray(key) ? key : [key];
        keys.forEach((item) => {
            sessionStorage.getItem(item) && sessionStorage.removeItem(item);
        });
    },
};

// localStorage
export const LStore = {
    set: (key, val) => {
        if (getType(key) === 'object') {
            Object.keys(key).forEach((k) => {
                var v = JSON.stringify(key[k]);
                localStorage.setItem(k, v);
            });
        } else {
            var item = JSON.stringify(val);
            localStorage.setItem(key, item);
        }
    },
    get: (key) => {
        return localStorage.getItem(key)
            ? JSON.parse(localStorage.getItem(key))
            : false;
    },
    del: (key) => {
        let keys = [];
        keys = Array.isArray(key) ? key : [key];
        keys.forEach((item) => {
            localStorage.getItem(item) && localStorage.removeItem(item);
        });
    },
};

// 只能输入数字
export function onlyNumber(str) {
    // eslint-disable-next-line
    return str.replace(/[^\d+]|[`,\.eE\-\+]/g, '');
}

// 编辑器
export const editorToolbar = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction
    [{ align: [] }],
    ['link', 'image', 'video'],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme,
    ['clean'],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
];

// bitmap 加密
export const bitmapEncode = (arr = []) => {
    var mapCount = 0;
    arr.forEach((item) => {
        mapCount += 1 << item;
    });
    return mapCount;
};
// bitmap 解密
export const bitmapDecode = (bitmap) => {
    if (bitmap < 0) {
        bitmap = 2147483647;
    }
    let arr = [];
    bitmap = bitmap
        .toString(2)
        .split('')
        .reverse();
    bitmap.forEach((item, index) => {
        if (item == 1) {
            arr.push(index);
        }
    });
    return arr;
};

// 格式化时间
export const formatDate = (date, fmt) => {
    date = new Date(date * 1);
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        );
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length)
            );
        }
    }
    return fmt;
};

/**
 * 下载文件
 * @param {string} url
 */
export function download(url) {
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * 导入失败然后下载二进制文件
 * @param {文件流} binary
 * @param {文件对象} file
 * @param {文件mimetype} mimeType
 */
export function downloadFile(
    data,
    file,
    mimeType = 'application/ms-excel;charset=utf-8'
) {
    let filename = file.name;
    let blob = new Blob(['\ufeff' + data], { type: mimeType });
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        let href = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.download = filename;
        a.href = href;
        a.click();
        window.URL.revokeObjectURL(href);
    }
}

export class UnitDate {
    constructor(date) {
        let { userAgent } = window.navigator;
        if (userAgent.includes('Safari')) {
            if (typeof date === 'string') {
                date = date.replace(/-/g, '/');
                return new Date(date);
            }
            return new Date(date);
        }
        return new Date(date);
    }
}

export const toggleFavicon = (url) => {
    var link =
        document.querySelector("link[rel*='icon']") ||
        document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
};
