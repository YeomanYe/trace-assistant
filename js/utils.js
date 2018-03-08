/**
 * 获取两个URL中相同的部分
 */
function getBaseUrl(url1, url2) {
    var arr1 = url1.split('/'),
        arr2 = url2.split('/');
    var sameArr = [];
    for (var i = 0, len = arr1.length; i < len; i++) {
        if (arr1[i] === arr2[i]) sameArr.push(arr1[i]);
    }
    return sameArr.join('/');
}

/**
 * 判断数组中是否有一个字符串在字符串中。并返回序列号。-1代表不存在
 * field代表数组中某个对象的某一字段
 */
function arrInStr(arr, str, field) {
    for (var i = 0, len = arr.length; i < len; i++) {
        if (!field) {
            if (str.indexOf(arr[i]) >= 0) return i;
        } else {
            var obj = arr[i];
            if (str.indexOf(obj[field]) >= 0) return i;
        }
    }
    return -1;
}
/**
 * 获取存储并执行回调函数
 */
function getStoreLocal(keys, callback) {
    chrome.storage.local.get(keys, function(resObj) {
        //不是字符串就是数组了
        if (typeof keys === 'string') {
            callback(resObj[keys]);
        } else {
            var vals = [];
            for (var i = 0, len = keys.length; i < len; i++) {
                vals.push(resObj[keys[i]]);
            }
            callback.apply(null, vals);
        }
    });
}
/**
 * 获取某站点下所有收藏的漫画,以及漫画中更新的数目
 */
function getFavs(siteName, defaultStore, callback) {
    getStoreLocal(['allFavs', 'updateNum'], function(allFavs, updateNum) {
        allFavs = allFavs ? allFavs : [];
        updateNum = updateNum ? updateNum : 0;
        var index = -1;
        if (allFavs.length) index = arrInStr(allFavs, siteName, 'site');
        var cols = [];
        if (index < 0) {
            defaultStore.cols = cols;
            allFavs.unshift(defaultStore);
        } else {
            cols = allFavs[index].cols;
        }
        callback(cols, allFavs, updateNum);
    });
}
/**
 * 减少更新的漫画数量，标志
 */
function decUpdateNum(item) {
    if (item.isUpdate) {
        item.isUpdate = false;
        getStoreLocal('updateNum', function(updateNum) {
            --updateNum;
            storLocal.set({
                updateNum: updateNum
            });
            chrome.runtime.sendMessage(null, 'updateNumChange');
        });
    }
}
/**
 * 更新阅读记录
 */
function updateColRecord(getCurComic) {
    return function(favs, allFavs) {
        var curComic = getCurComic();
        //解析当前页面并更新阅读记录
        var index = arrInStr(favs, curComic.title, 'title');
        if (index < 0) return;
        //更新图标
        _$imgToggle.get(0).src = _src.collect;
        var curItem = favs[index];
        if (!curComic.curChapter) return;
        curItem.curChapter = curComic.curChapter;
        curItem.curUrl = curComic.curUrl.replace(baseChapterUrl, '');
        //更新，当前更新的漫画数量
        decUpdateNum(curItem);
        storLocal.set({
            allFavs: allFavs
        });
    }
}
/**
 * 查询是否有更新的通用函数
 */
function queryUpdate(baseObj, callback) {
    var baseIndex = baseObj.baseIndex;
    var baseImage = baseObj.baseImage;
    var baseChapter = baseObj.baseChapter;
    return function(favs, allFavs, updateNum) {
        var sucCall = function(data) {
            var resObj = callback(data);
            var newUrl = resObj.newUrl,
                newChapter = resObj.newChapter;
            if (col.newChapter != newChapter) {
                col.newChapter = newChapter;
                col.newUrl = newUrl;
                createNotify(col.title, baseImage + col.imgUrl, '更新到: ' + newChapter, baseChapter + newUrl);
                if (!col.isUpdate) {
                    col.isUpdate = true;
                    setBadge(++updateNum);
                }
                //更新收藏
                chrome.storage.local.set({
                    allFavs: allFavs,
                    updateNum: updateNum
                });
            }
        };
        for (var i = 0, len = favs.length; i < len; i++) {
            var col = favs[i];
            var indexUrl = col.indexUrl;
            $.ajax(baseIndex + indexUrl, {
                success: sucCall,
                async: false
            });
        }
    }
}
/**
 * 替换origin
 */
function replaceOrigin(url, newOrigin) {
    var restArgs = newOrigin.split('/');
    var urlArr = url.split('/');
    restArgs.unshift(0, 3);
    [].splice.apply(urlArr, restArgs);
    return urlArr.join('/');
}