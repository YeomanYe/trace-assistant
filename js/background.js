var chrNotify = chrome.notifications;
var storLocal = chrome.storage.local;
var log = console.log;
var _allFavs;
var kuaikanFavs;
var updateNum;
storLocal.get('allFavs',function(resObj){
    _allFavs = resObj.allFavs;
    //初始化更新数
    updateBadge(kuaikanQuery);
});

//监听消息
chrome.runtime.onMessage.addListener(function(msg){
    switch(msg){
        case 'updateNumChange':updateBadge();break;
    }
});
/**
 * 更新徽章数
 */
function updateBadge(callback){
    storLocal.get('updateNum',function(resObj){
        updateNum = resObj.updateNum;
        updateNum = updateNum ? updateNum : 0;
        setBadge(updateNum);
        if(callback)callback();
    });
}


/**
 * 设置徽章
 */
function setBadge(num){
    if(!num) return;
    chrome.browserAction.setBadgeText({text:''+num});
    chrome.browserAction.setBadgeBackgroundColor({color: 'red'})
}

/**
 * 点击提醒打开链接
 */
chrome.notifications.onClicked.addListener(function(url){
    log('url',url);
    window.open(url);
});

/**
 * 创建提醒
 */
function createNotify(title,iconUrl,message,newUrl){
    var options = {
        type:chrome.notifications.TemplateType.BASIC,
        title:title,
        iconUrl:iconUrl,
        isClickable:true,
        message:message
    };
    chrome.notifications.create(newUrl,options);
}
/**
 * 查询收藏的快看漫画是否有更新
 */
function kuaikanQuery(){
    //第一次调用时获取保存的漫画记录
    if(!kuaikanFavs && _allFavs){
        for(var i=0,len=_allFavs.length;i<len;i++){
            var item = _allFavs[i];
            if(item.origin.indexOf('kuaikan')>=0){
                kuaikanFavs = item;
            }
        }
    }
    if(!kuaikanFavs) return;

    var baseIndex = kuaikanFavs.baseIndex;
    var baseImage = kuaikanFavs.baseImg;
    var baseChapter = kuaikanFavs.baseChapter;
    var favs = kuaikanFavs.cols;
    var sucCall = function(data){
        var $html = $(data);
        var aElm = $html.find('table .tit a').get(0);
        var newChapter = aElm.title;
        var tmpArr = aElm.href.split('/');
        var newUrl =tmpArr[tmpArr.length - 2];
        if(col.newChapter != newChapter){
            col.newChapter = newChapter;
            col.newUrl = newUrl;
            col.isUpdate = true;
            createNotify(col.title,baseImage + col.imgUrl,'更新到: '+newChapter,baseChapter+newUrl);
            setBadge(++updateNum);
        }
    };
    for(var i=0,len=favs.length;i<len;i++){
        var col = favs[i];
        var indexUrl = col.indexUrl;
        $.ajax(baseIndex+indexUrl,{
            success:sucCall,
            async:false
        });
    }
    setTimeout(kuaikanQuery,1000 * 10 * 60);
    storLocal.set({
        allFavs:_allFavs,
        updateNum:updateNum
    });
}