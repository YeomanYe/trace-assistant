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
/**
 * 获取存储并执行回调函数
 */
function getStoreLocal(keys,callback){
    chrome.storage.local.get(keys,function(resObj){
        //不是字符串就是数组了
        if(typeof keys === 'string'){
            callback(resObj[keys]);
        }else{
            var vals = [];
            for(var i=0,len=keys.length;i<len;i++){
                vals.push(resObj[keys[i]]);
            }
            callback.apply(null,vals);
        }
    });
}

function getFavs(siteName,defaultStore,callback){
    getStoreLocal('allFavs',function(allFavs){
        var index = arrInStr(allFavs,siteName,'site');
        var cols = [];
        if(index < 0){
            defaultStore.cols = cols;
            allFavs.push(defaultStore);
        }else{
            cols = allFavs[index].cols;
        }
        callback(cols,allFavs);
    });
}