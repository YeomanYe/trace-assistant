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
        firstQuery();
        setTimeout(allQuery, 1000 * 60);
    };
    allQuery();
}

updateBadge();
allQuery();
//监听消息
chrome.runtime.onMessage.addListener(function(msg,msgSenderObj,resSend) {
    var msgArr = msg.split('@-@');
    switch (msgArr[0]) {
        case 'updateNumChange':
            updateBadge();
            break;
        case 'exportCollect':
            exportCollect(msgArr,resSend);
            break;
    }
    return true;
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
    getStoreLocal('updateNum',function(updateNum){
        updateNum = updateNum ? updateNum : 0;
        setBadge(updateNum);
    })
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
 * 导出收藏的漫画
 */
function exportCollect(args,resSend) {
    var origin = args[1];
    var keys = Object.keys(_exportFunObj);
    var index = arrInStr(keys,origin);
    _exportFunObj[keys[index]](args,resSend);
}