var storLocal = chrome.storage.local;
var log = console.log;
var sendMsg = chrome.runtime.sendMessage;
var _createQueryObjProto = {
    setAfterStore: function(queryFun, hangFun) {
        queryFun.afterStore = function(callback) {
            hangFun._afterStore = callback;
            return callback;
        };
    }
};
var _createQueryObj = Object.create(_createQueryObjProto);
var _exportFunObj = {};

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
    var baseImage = baseObj.baseImg;
    var baseChapter = baseObj.baseChapter;
    var afterStoreCall = callback._afterStore ? callback._afterStore : function() {}; //存储成功之后的回调函数
    var isUpdate = false;
    return function(favs, allFavs, updateNum) {
        var sucCall = function(data) {
            try {
                var resObj = callback(data);
                var newUrl = resObj.newUrl,
                    newChapter = resObj.newChapter;
                if (col.newChapter !== newChapter) {
                    col.newChapter = newChapter;
                    col.newUrl = newUrl;
                    createNotify(col.title, baseImage + col.imgUrl, '更新到: ' + newChapter, baseChapter + newUrl);
                    isUpdate = true;
                    if (!col.isUpdate) {
                        col.isUpdate = true;
                        setBadge(++updateNum);
                    }
                    storLocal.set({
                        updateNum: updateNum,
                        allFavs: allFavs
                    }, afterStoreCall);
                }
            }catch(e){
                log(e);
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
        if (!isUpdate) afterStoreCall();
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
/**
 * 收藏或取消收藏
 */
function toggleFav(storObj, getCurComic, getChapterInfo) {
    var baseImgUrl = storObj.baseImg,
        baseIndex = storObj.baseIndex,
        baseChapter = storObj.baseChapter;
    var tmpObj = getCurComic();
    var title = tmpObj.title,
        indexUrl = tmpObj.indexUrl,
        curUrl = tmpObj.curUrl,
        curChapter = tmpObj.curChapter;
    return function(favs, allFavs) {
        var index = arrInStr(favs, title, 'title');
        //已经收藏，则取消收藏
        if (index >= 0) {
            var item = favs[index];
            decUpdateNum(item);
            favs.splice(index, 1);
            storLocal.set({
                allFavs: allFavs
            });
            showTips('取消收藏成功');
            return;
        }
        //未收藏，则收藏
        var sucCall = function(text) {
            //获取章节与图片信息
            var obj = getChapterInfo(text);
            curChapter = curChapter ? curChapter : obj.curChapter;
            curUrl = curUrl ? curUrl : obj.curUrl;
            var col = {
                imgUrl: obj.imgUrl.replace(baseImgUrl, ''),
                indexUrl: indexUrl.replace(baseIndexUrl, ''),
                newChapter: obj.newChapter,
                curChapter: curChapter,
                newUrl: obj.newUrl.replace(baseChapterUrl, ''), //最新章节地址
                curUrl: curUrl.replace(baseChapterUrl, ''), //当前章节地址
                title: title,
                isUpdate: false
            };
            favs.unshift(col);
            chrome.storage.local.set({
                allFavs: allFavs
            });
            showTips('收藏成功');
        };
        $.ajax(indexUrl, {
            success: sucCall
        });
    }
}
/**
 * 创建提醒
 */
function createNotify(title, iconUrl, message, newUrl) {
    var options = {
        type: chrome.notifications.TemplateType.BASIC,
        title: title,
        iconUrl: iconUrl,
        isClickable: true,
        message: message
    };
    chrome.notifications.create(newUrl, options);
}
/**
 * 创建toast提醒
 */
function showTips(msg) {
    var $div = $('<div>');
    $div.text(msg);
    var width = $(window).width(),
        height = $(window).height();
    $div.css({
        position: 'fixed',
        padding: '20px',
        top: height / 2 - 40,
        left: width / 2 - 40,
        'font-size': '18px',
        background: 'black',
        color: 'white'
    });
    $('body').append($div);
    setTimeout(function() {
        $div.remove();
    }, 1000);
}
/**
 * 处理响应数据
 */
function handleResData(data) {
    log('handleResData', data);
    var status = data.status;
    if (!status) {
        showTips('操作成功');
    } else if (status === 1) {
        showTips('请先登录');
    }
}
/**
 * 根据决定条件决定是否执行导出函数，如果执行则将导出的漫画存储在本地中
 * extra需要从datas中带入到handlefun中的数据的字段的名称
 */
function pipeExport(dataArg,handleFun,resSend){
    var site = dataArg.site,datas = dataArg.datas;
    var storObj = getBaseStoreObj(site),
        baseImgUrl = storObj.baseImg,
        baseIndexUrl = storObj.baseIndex,
        baseChapter = storObj.baseChapter,
        origin = storObj.origin;
    var indexSucCall = function(cols,indexUrl,args){
        return function(text){
            var colItem = handleFun(text,resSend,args);
            //处理数据格式
            var newUrl = replaceOrigin(colItem.newUrl, origin).replace(baseChapter, ''),

            curUrl = replaceOrigin(colItem.curUrl, origin).replace(baseChapter, '');
            colItem.newUrl = newUrl;
            colItem.curUrl = curUrl;
            colItem.indexUrl = indexUrl;
            colItem.imgUrl = colItem.imgUrl.replace(baseImgUrl,'');
            colItem.isUpdate = false;

            var index = arrInStr(cols,colItem.title,'title');
            if(index < 0) cols.push(colItem);
        }
    }
    getFavs(site, storObj, function(cols, allFavs) {
        for (var i = 0, len = datas.length; i < len; i++) {
            var item = datas[i];
            var index = arrInStr(cols, item.title, 'title');
            //当收藏中没有该漫画时才添加
            if (index < 0) {
                $.ajax(baseIndexUrl + item.indexUrl, {
                    success: indexSucCall(cols,item.indexUrl,item),
                    async: false
                });
            }
        }
        storLocal.set({
            allFavs: allFavs
        });
        resSend({
            status: 0
        });
    });
}

/**
 * 存储消抖函数
 */
var storeDebounce = function(obj) {
    var storeDebounceTimeout;
    storeDebounce = function(obj) {
        if (storeDebounceTimeout) {
            clearTimeout(storeDebounceTimeout);
        }
        storeDebounceTimeout = setTimeout(function() {
            chrome.storage.local.set(obj);
        }, 500);
    }
    storeDebounce(obj);
}