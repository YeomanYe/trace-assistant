/**
 * 判断数组中是否有一个字符串在目标字符串中。并返回序列号。-1代表不存在
 * field代表数组中某个对象的某一字段
 */
export function arrInStr(arr, strs) {
    let flag;
    for (let i = 0, len = arr.length; i < len; i++) {
        let obj = arr[i];
        flag = true;
        if (typeof strs === 'object') {
            let keys = Object.keys(strs);
            //为数组的情况
            for (let j = 0, len2 = keys.length; j < len2; j++) {
                if (strs[keys[j]].indexOf(obj[keys[j]]) < 0) {
                    flag = false;
                    break;
                }
            }
            if (flag) return i;
        } else if (strs.indexOf(obj) >= 0) {
            return i;
        }
    }
    return -1;
}

/**
 * 判断数组中是否有一个字符串等于目标字符串。并返回序列号。-1代表不存在
 * field代表数组中某个对象的某一字段
 */
export function arrEqStr(arr, strs) {
    let flag;
    for (let i = 0, len = arr.length; i < len; i++) {
        let obj = arr[i];
        flag = true;
        if (typeof strs === 'object') {
            let keys = Object.keys(strs);
            //为数组的情况
            for (let j = 0, len2 = keys.length; j < len2; j++) {
                if (strs[keys[j]] !== obj[keys[j]]) {
                    flag = false;
                    break;
                }
            }
            if (flag) return i;
        } else if (strs === obj) {
            return i;
        }
    }
    return -1;
}
