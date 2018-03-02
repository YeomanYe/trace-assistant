var chrNotify = chrome.notifications;
var storSync = chrome.storage.sync;
var log = console.log;
var _allFavs;
var kuaikanFavs;
storSync.get('allFavs',function(resObj){
    _allFavs = resObj.allFavs;
});

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
    if(!kuaikanFavs){
        for(var i=0,len=_allFavs.length;i<len;i++){
            var item = _allFavs[i];
            if(item.origin.indexOf('kuaikan')>=0){
                kuaikanFavs = item;
            }
        }
    }
    var baseIndex = kuaikanFavs.baseIndex;
    var baseImage = kuaikanFavs.baseImg;
    var favs = kuaikanFavs.cols;
    var sucCall = function(data){
        var $html = $(data);
        var aElm = $html.find('#main table .tit a').get(0);
        var newChapter = aElm.innerText;
        var newUrl = aElm.href;
        if(col.newChapter != newChapter){
            col.newChapter = newChapter;
            col.newUrl = newUrl;
            col.isUpdate = true;
            createNotify(col.title,baseImage + col.imgUrl,'更新到: '+newChapter,newUrl);
        }
    };
    for(var i=0,len=favs.length;i<len;i++){
        var col = favs[i];
        indexUrl = col.indexUrl;
        $.ajax(baseIndex+indexUrl,{
            success:sucCall
        });
    }
}

setInterval(kuaikanQuery,1000);