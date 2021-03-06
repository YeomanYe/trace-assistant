/**
 * 查询是否有更新
 */
var allQuery = function() {
    var keys = Object.keys(_createQueryObj);
    var firstQuery = _createQueryObj[keys[0]](),nextQuery = firstQuery;
    //创建查询链
    for(var i=1,len=keys.length;i<len;i++){
        nextQuery = nextQuery.afterStore(_createQueryObj[keys[i]]());
    }
    allQuery = function(){
        setBadge('....','blue'); //提示正在查询中
        firstQuery();
        setTimeout(allQuery, 1000 * 60 * 45);
    };
    allQuery();
};

updateBadge(allQuery);

//监听消息
chrome.runtime.onMessage.addListener(function(msgArr,msgSenderObj,resSend) {
    switch (msgArr[0]) {
        case BG_CMD_UPDATE_NUM:
            updateBadge();
            break;
        case BG_CMD_EXPORT:
            exportCollect(msgArr,resSend);
            break;
        case BG_CMD_UPDATE_FAV_BTN:
            sendToAllTabs([CNT_CMD_UPDATE_CUR_FAV]);
            break;
    }
    return true;
});

//点击提醒打开链接
chrome.notifications.onClicked.addListener(function(url) {
    log('url', url);
    window.open(url);
});

chrome.notifications.onButtonClicked.addListener(function(url,btnIndex){
    var updateToNews = function(){
        getStoreLocal([STOR_KEY_FAVS,STOR_KEY_UPDATE_NUM],function(allFavs,updateNum){
            for(var len = allFavs.length;--len;){
                var favItem = allFavs[len];
                var cols = favItem.cols;
                for(var len2=cols.length;len2--;){
                    var colItem = cols[len2];
                    var url2 = formatHref(colItem.newUrl,favItem.baseChapter);
                    if(url == url2) {
                        colItem.curChapter = colItem.newChapter;
                        colItem.curUrl = colItem.newUrl;
                        colItem.isUpdate = false;
                        storLocal.set({[STOR_KEY_FAVS]:allFavs,[STOR_KEY_UPDATE_NUM]:--updateNum});
                        return;
                    }
                }
            }
        });
    }
    switch(btnIndex){
        case 0:window.open(url);break;
        case 1:updateToNews();break;
    }
    chrome.notifications.clear(url);
});

/**
 * 更新徽章数
 */
function updateBadge(callback) {
    getStoreLocal(STOR_KEY_UPDATE_NUM,function(updateNum){
        updateNum = updateNum ? updateNum : 0;
        setBadge(updateNum);
        if(callback) callback();
    })
}


/**
 * 设置徽章
 */
function setBadge(num,color) {
    color = color ? color : 'red';
    if (num <= 0) {
        chrome.browserAction.setBadgeText({
            text: ''
        });
        chrome.browserAction.setBadgeBackgroundColor({
            color: color
        });
        storLocal.set({
            [STOR_KEY_UPDATE_NUM]: 0
        });
        return;
    }
    chrome.browserAction.setBadgeText({
        text: '' + num
    });
    chrome.browserAction.setBadgeBackgroundColor({
        color: color
    })
}


/**
 * 导出收藏
 */
function exportCollect(args,resSend) {
    var origin = args[1];
    var type = args[2];
    var keys = Object.keys(_exportFunObj);
    var siteArr = [];
    for(var i=0,len=keys.length;i<len;i++){
        var tmpArr = keys[i].split('-');
        siteArr.push(tmpArr[0]);
    }
    var index = arrInStr(siteArr,origin);
    _exportFunObj[siteArr[index]+'-'+type](args,resSend);
}
