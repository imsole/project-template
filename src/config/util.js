import XLSX from 'xlsx'
// 检测空对象
export const isEmptyObject = (o) => {
    var item;
    for(item in o){
        return false;
    }
    return true;
}

// localStore 存储
export const Store = {
    set : (name, o) => {
        var item = JSON.stringify(o);
        sessionStorage.setItem(name, item);
    },
    get : (item) => {
        var o = sessionStorage.getItem(item) ? sessionStorage.getItem(item) : '{}';
        return isEmptyObject(o) ? false : o === '{}' ? false : JSON.parse(o);
    },
    del : (item) => {
        sessionStorage.getItem(item) && sessionStorage.removeItem(item);
    }
};

// 编辑器
export const editorToolbar = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
    [{'direction': 'rtl'}],                         // text direction
    [{'align': []}],
    ['link', 'image', 'video'],

    [{'color': []}, {'background': []}],          // dropdown with defaults from theme,
    ['clean'],
    [{'header': [1, 2, 3, 4, 5, 6, false]}]
]

// bitmap 加密
export const bitmapEncode = (arr=[]) => {
    var mapCount = 0;
    arr.forEach(item => {
        mapCount += (1<<item);
    });
    return mapCount;
};
// bitmap 解密
export const bitmapDecode = (bitmap) => {
    if (bitmap < 0) {
        bitmap = 2147483647;
    }
    let arr = [];
    bitmap = bitmap.toString(2).split('').reverse();
    bitmap.forEach((item,index) => {
       if(item == 1) {
           arr.push(index);
       }
   });
   return arr;
}

// 格式化时间
export const formatDate = (date, fmt) => {
    date = new Date(date*1);
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length))
        }
    }
    return fmt;
};

// 求出多个数组的交集
export const collection = (arr) => {
    if (arr.length == 1) {
        return arr[0];
    }
    var def = arr[0];
    return arr.reduce((pre, cur, index, arr)=>{
        def = def.filter((n) => {
            return cur.indexOf(n) != -1;
        });
        return def;
    });
}


// 导出数据
export const exportList = (data, filename, fields) => {
    let list = JSON.parse( JSON.stringify(data) );
    let newList = [];
    let targetKeys = Object.keys(fields);
    list.forEach(row => {
        let newRow = {};
        for(let col in row){
            let index = targetKeys.indexOf(col);
            if (index >= 0) {
                newRow[ fields[targetKeys[index]] ] = row[col];
            }
        }
        newList.push(newRow);
    })

    let table = XLSX.utils.json_to_sheet(newList);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, table, 'Sheet1');
    XLSX.writeFile(wb, filename+'.xlsx')
}
// 财务汇总表用 - 同时导出多个sheet
export const exportTable = (tables, filename, fields, sheetName) => {
    let newTables = [];
    tables.forEach((item,index) => {
        let list = JSON.parse( JSON.stringify(item) );
        let targetKeys = Object.keys(fields[index]);
        newTables.push([]);

        list.forEach(row => {
            let newRow = {};
            for(let col in row){
                let m = targetKeys.indexOf(col);
                if (m >= 0) {
                    newRow[ fields[index][targetKeys[m]] ] = row[col];
                }
            }
            newTables[index].push(newRow);
        });
    });

    let wb = XLSX.utils.book_new();
    newTables.forEach((item,index) => {
        let table = XLSX.utils.json_to_sheet(item);
        XLSX.utils.book_append_sheet(wb, table, sheetName[index]);
    });
    XLSX.writeFile(wb, filename+'.xlsx')
}

export class UnitDate {
    constructor (date) {
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
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
}