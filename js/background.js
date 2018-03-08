var chrNotify = chrome.notifications;
var storLocal = chrome.storage.local;
var log = console.log;
var _allFavs;
var kuaikanFavs;
var updateNum;
/*storLocal.get('allFavs', function(resObj) {
    _allFavs = resObj.allFavs ? resObj.allFavs : [];
    //初始化更新数
    updateBadge(kuaikanQuery);
});*/
updateBadge();
allQuery();
//监听消息
chrome.runtime.onMessage.addListener(function(msg) {
    var msgArr = msg.split('-');
    switch (msgArr[0]) {
        case 'updateNumChange':
            updateBadge();
            break;
        case 'exportCollect':
            exportCollect(msgArr[1]);
            break;
        case 'reloadStore':
            break; //重新加载存储
    }
});

//点击提醒打开链接
chrome.notifications.onClicked.addListener(function(url) {
    log('url', url);
    window.open(url);
});

/**
 * 更新徽章数
 */
function updateBadge() {
    storLocal.get('updateNum', function(resObj) {
        updateNum = resObj.updateNum;
        updateNum = updateNum ? updateNum : 0;
        setBadge(updateNum);
    });
}


/**
 * 设置徽章
 */
function setBadge(num) {
    if (num <= 0) {
        chrome.browserAction.setBadgeText({
            text: ''
        });
        chrome.browserAction.setBadgeBackgroundColor({
            color: 'red'
        });
        storLocal.set({
            updateNum: 0
        });
        return;
    }
    chrome.browserAction.setBadgeText({
        text: '' + num
    });
    chrome.browserAction.setBadgeBackgroundColor({
        color: 'red'
    })
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
 * 查询是否有更新
 */
function allQuery() {
    getFavs('kuaikan',{},kuaikanQuery());
    getFavs('ac.qq',{},qqQuery);
    setTimeout(allQuery,1000 * 60 * 10);
}
/**
 * 查询收藏的腾讯漫画是否有更新
 */
function qqQuery(favs,allFavs,updateNum){

}
/**
 * 查询收藏的快看漫画是否有更新
 */
/*function kuaikanQuery(favs,allFavs,updateNum) {
    var baseIndex = 'http://www.kuaikanmanhua.com/web/topic/';
    var baseImage = 'https://i1s.kkmh.com/image';
    var baseChapter = 'http://www.kuaikanmanhua.com/web/comic/';
    var sucCall = function(data) {
        var $html = $(data);
        var aElm = $html.find('table .tit a').get(0);
        var newChapter = aElm.title;
        var tmpArr = aElm.href.split('/');
        var newUrl = tmpArr[tmpArr.length - 2];
        if (col.newChapter != newChapter) {
            col.newChapter = newChapter;
            col.newUrl = newUrl;
            col.isUpdate = true;
            createNotify(col.title, baseImage + col.imgUrl, '更新到: ' + newChapter, baseChapter + newUrl);
            setBadge(++updateNum);
            //更新收藏
            storLocal.set({
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
}*/
function kuaikanQuery() {
    var baseObj = {
        baseIndex :'http://www.kuaikanmanhua.com/web/topic',
        baseImage: 'https://i1s.kkmh.com/image',
        baseChapter :'http://www.kuaikanmanhua.com/web/comic/'
    };
    var ajaxCall = function(data) {
        var $html = $(data);
        var aElm = $html.find('table .tit a').get(0);
        var newChapter = aElm.title;
        var tmpArr = aElm.href.split('/');
        var newUrl = tmpArr[tmpArr.length - 2];
        var resObj = {
            newUrl:newUrl,
            newChapter:newChapter
        };
        return resObj;
    };
    return queryUpdate(baseObj,ajaxCall);
}

function exportCollect(origin) {
    if (origin.indexOf('kuaikan')) {
        kuaikanExport(origin);
    }
}
var storObj = {};
/**
 * 快看漫画导出用户的收藏
 */
function kuaikanExport(origin) {
    var baseImgUrl = 'https://i1s.kkmh.com/image',
        baseChapterUrl = origin + '/web/comic/',
        baseIndexUrl = origin + '/web/topic';

    var kuaikanStorObj = {
        baseImg: baseImgUrl,
        baseIndex: baseIndexUrl,
        baseChapter: baseChapterUrl,
        origin: origin,
        site: 'kuaikan'
    };
    storObj.kuaikan = kuaikanStorObj;
    var pageNum = 1,
        baseUrl = origin + '/web/fav/topics',
        size = 16;
    getFavs('kuaikan', kuaikanStorObj, function(cols, allFavs) {
        //递归遍历，获取所有的收藏结果
        var successCallback = function(resData) {
            log('resData', resData);
            var datas = resData.data.topics;
            var storDatas = [];
            if (!baseImgUrl) {
                //获取url中相同的部分
                if (datas.length > 1)
                    baseImgUrl = getBaseUrl(datas[0].vertical_image_url, datas[1].vertical_image_url);
            }
            datas.forEach(function(data) {
                var indexCompleteUrl = baseIndexUrl + '/' + data.id;
                var resText = $.ajax(indexCompleteUrl, {
                    async: false
                }).responseText;
                // log('resText',resText);
                $html = $(resText);
                $as = $html.find('.tit a');
                log('$as', $as);
                var newA = $as.get(0),
                    curA = $as.get($as.length - 1);
                //如果数组中有标题和目录链接则说明已经存在该漫画了
                var title = data.title,
                    indexUrl = '/' + data.id;
                if (arrInStr(cols, title, 'title') >= 0 && arrInStr(cols, indexUrl, 'indexUrl') >= 0) return;
                var tmpArr, newUrl, curUrl;
                tmpArr = newA.href.split('/');
                newUrl = tmpArr[tmpArr.length - 2] + '/';
                tmpArr = curA.href.split('/');
                curUrl = tmpArr[tmpArr.length - 2] + '/';
                storDatas.push({
                    imgUrl: data.vertical_image_url.replace(baseImgUrl, ''),
                    indexUrl: indexUrl,
                    newUrl: newUrl, //最新章节地址
                    curUrl: curUrl, //当前章节地址
                    newChapter: data.latest_comic_title, //最新章节名称
                    curChapter: curA.innerText.replace(/\s/g, ''), //当前章节名称
                    title: title,
                    isUpdate: false
                });
            });
            cols = cols.concat(storDatas);
            log('storDatas', storDatas);
            if (datas.length === size) {
                ++pageNum;
                var url = baseUrl + '?page=' + pageNum + '&size=' + size;
                log('url', url);
                $.ajax(url, {
                    success: successCallback
                });
            } else {
                kuaikanStorObj.cols = cols;
                log('storObj', kuaikanStorObj);
                log('allFavs', allFavs);
                storLocal.set({
                    'allFavs': allFavs
                });
            }
        };
        $.ajax(baseUrl + '?page=' + pageNum + '&size=' + size, {
            success: successCallback
        });
    });
}
