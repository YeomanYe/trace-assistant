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
    var msgArr = msg.split('@-@');
    switch (msgArr[0]) {
        case 'updateNumChange':
            updateBadge();
            break;
        case 'exportCollect':
            exportCollect(msgArr);
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
    getFavs('kuaikan', {}, kuaikanQuery());
    getFavs('ac.qq', {}, qqQuery());
    setTimeout(allQuery, 1000 * 60 * 10);
}
/**
 * 查询收藏的快看漫画是否有更新
 */
function kuaikanQuery() {
    var baseObj = {
        baseIndex: 'http://www.kuaikanmanhua.com/web/topic',
        baseImage: 'https://i1s.kkmh.com/image',
        baseChapter: 'http://www.kuaikanmanhua.com/web/comic/'
    };
    var ajaxCall = function(data) {
        var $html = $(data);
        var aElm = $html.find('table .tit a').get(0);
        var newChapter = aElm.title;
        var tmpArr = aElm.href.split('/');
        var newUrl = tmpArr[tmpArr.length - 2];
        var resObj = {
            newUrl: newUrl,
            newChapter: newChapter
        };
        return resObj;
    };
    return queryUpdate(baseObj, ajaxCall);
}
/**
 * 查询收藏的腾讯漫画是否有更新
 */
function qqQuery() {
    var baseObj = {
        baseIndex: 'http://ac.qq.com/Comic/comicInfo/id/',
        baseImage: 'https://manhua.qpic.cn/vertical/',
        baseChapter: 'http://ac.qq.com/ComicView/index/id/'
    };
    var ajaxCall = function(data) {
        var $html = $(data);
        var baseChapter = 'http://ac.qq.com/ComicView/index/id/';
        var $as = $html.find('.chapter-page-all a');
        var newA = $as.get($as.length - 1);
        var tmpArr = newA.title.split('：');
        var newChapter = tmpArr[1];
        var newUrl = newA.href;
        newUrl = replaceOrigin(newUrl,'http://ac.qq.com');
        newUrl = newUrl.replace(baseChapter,'');
        var resObj = {
            newUrl: newUrl,
            newChapter: newChapter
        };
        return resObj;
    };
    return queryUpdate(baseObj, ajaxCall);
}

function exportCollect(args) {
    var origin = args[1];
    if (origin.indexOf('kuaikan') >= 0) {
        kuaikanExport(origin);
    } else if (origin.indexOf('ac.qq') >= 0) {
        qqExport(args);
    }
}
/**
 * 腾讯动漫导出用户的收藏
 */
function qqExport(args) {
    var dataStr = args[2];
    var userCols = JSON.parse(dataStr).data;
    var origin = args[1],
        baseImgUrl = 'https://manhua.qpic.cn/vertical/',
        baseChapterUrl = origin + '/ComicView/index/id/',
        baseIndexUrl = origin + '/Comic/comicInfo/id/';

    var storObj = {
        baseImg: baseImgUrl,
        baseIndex: baseIndexUrl,
        baseChapter: baseChapterUrl,
        origin: origin,
        site: 'ac.qq'
    };
    var indexCall = function(item,curSeqNo){
        return function(text){
            $html = $(text);
            var $as = $html.find('.chapter-page-all a');
            var newA = $as.get($as.length - 1),curA = $as.get(curSeqNo);
            var tmpArr = newA.title.split('：');
            var newChapter,curChapter;
            newChapter = tmpArr[1];
            tmpArr = curA.title.split('：');
            curChapter = tmpArr[1];
            var newUrl = newA.href,curUrl = curA.href;
            newUrl = replaceOrigin(newUrl,'http://ac.qq.com').replace(baseChapter,'');
            curUrl = replaceOrigin(curUrl,'http://ac.qq.com').replace(baseChapter,'');
            item.newChapter = newChapter;
            item.curChapter = curChapter;
            item.newUrl = newUrl;
            item.curUrl = curUrl;
        }
    };
    getFavs('ac.qq', storObj, function(cols, allFavs) {
        for (var i = 0, len = userCols.length; i < len; i++) {
            var item = userCols[i];
            var index = arrInStr(cols, item.title, 'title');
            //当收藏中没有该漫画时才添加
            if (index < 0) {
                var col = {
                    imgUrl: item.coverUrl.replace(baseImgUrl, ''),
                    indexUrl: item.id,
                    // newUrl: item.id + '/seqno/' + item.lateSeqNo, //最新章节地址
                    // curUrl: item.id + '/seqno/' + item.nextSeqNo, //当前章节地址
                    title: item.title,
                    isUpdate: false
                };
                $.ajax(baseIndexUrl+col.indexUrl,{
                    success:indexCall(col,item.nextSeqNo),
                    async:false
                });
                cols.push(col);
            }
            storLocal.set({
                allFavs: allFavs
            });
        }
    });
}
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