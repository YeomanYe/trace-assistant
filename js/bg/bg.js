var chrNotify = chrome.notifications;
var storLocal = chrome.storage.local;
var log = console.log;

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
var kuaikanQuery,qqQuery,mhdmzjQuery,w3dmzjQuery;
/**
 * 查询是否有更新
 */
function allQuery() {
    if(!qqQuery){
        qqQuery = createQqQuery();
        mhdmzjQuery = createMhdmzjQuery();
        w3dmzjQuery = createW3dmzjQuery();
        kuaikanQuery = createKuaikanQuery();
    }
    mhdmzjQuery.afterStore(w3dmzjQuery).afterStore(qqQuery).afterStore(kuaikanQuery);
    mhdmzjQuery();
    setTimeout(allQuery, 1000 * 60 * 10);
}

/**
 * 导出收藏的漫画
 */
function exportCollect(args,resSend) {
    var origin = args[1];
    if (origin.indexOf('kuaikan') >= 0) {
        kuaikanExport(origin,resSend);
    } else if (origin.indexOf('ac.qq') >= 0) {
        qqExport(args,resSend);
    }else if(origin.indexOf('i.dmzj')){
        dmzjExport(args,resSend);
    }
}