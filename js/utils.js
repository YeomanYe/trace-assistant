/**
 * 获取两个URL中相同的部分
 */
function getBaseUrl(url1,url2){
    var arr1 = url1.split('/'),
        arr2 = url2.split('/');
    var sameArr = [];
    for(var i=0,len=arr1.length;i<len;i++){
        if(arr1[i] === arr2[i]) sameArr.push(arr1[i]);
    }
    return sameArr.join('/');
}

/**
 * 判断数组中是否有一个字符串在字符串中。并返回序列号。-1代表不存在
 * field代表数组中某个对象的某一字段
 */
function arrInStr(arr,str,field){
    for(var i=0,len=arr.length;i<len;i++){
        if(!field){
            if(str.indexOf(arr[i])>=0) return i;
        }
        else{
            var obj = arr[i];
            if(str.indexOf(obj[field])>=0) return i;
        }
    }
    return -1;
}