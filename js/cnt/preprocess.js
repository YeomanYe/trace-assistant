var _$imgAss,_$imgExport,_$imgToggle;
var curHref = location.origin + location.pathname;
var cGetUrl = chrome.runtime.getURL;
var storLocal = chrome.storage.local;
var _src = {
    collect:cGetUrl('images/collect.png'),
    collectGrey:cGetUrl('images/collect-grey.png'),
    exportCollect:cGetUrl('images/export-collect.png'),
    comicGrey:cGetUrl('images/comic-grey.png'),
    comic:cGetUrl('images/comic.png')
};
var _updateCurFavFun;
//获取基本信息
var origin = location.origin,
    storObj = getBaseStoreObj(origin);
if(storObj){
    var baseImgUrl = storObj.baseImg,
        baseChapterUrl = storObj.baseChapter,
        baseIndexUrl = storObj.baseIndex;
}
chrome.runtime.onMessage.addListener(function(msgArr,msgSenderObj,resSend) {
    switch (msgArr[0]) {
        case CNT_CMD_UPDATE_CUR_FAV:
            if(_updateCurFavFun) _updateCurFavFun();
            break;
    }
    return true;
});
//创建按钮
function createBtn(){
    var $ul = $('<ul>');
    $ul.addClass('img-list');
    $ul.attr({draggable:true});
    _$imgExport = addImgToUL($ul,_src.exportCollect,null,'导出网站中收藏的漫画到插件中');
    _$imgToggle = addImgToUL($ul,_src.collectGrey,null,'收藏');
    _$imgAss = addImgToUL($ul,_src.comicGrey,toggleMenu,'切换菜单');
    _$imgExport.toggle();
    _$imgToggle.toggle();
    // setDraggable($ul);
    $('body').append($ul);
}
//给ul列表中加入一个图片
function addImgToUL($ul,srcStr,clickHandler,title){
    var $li = $('<li>'),$img = $('<img>');
    $img.addClass('fab-img');
    $img.get(0).src = srcStr;
    $img.get(0).title = title;
    if(clickHandler) $img.on('click',clickHandler);
    $li.append($img);
    $ul.append($li);
    return $img;
}
/**
 * 设置元素可拖动
 */
function setDraggable($elm){
    var dragging = false;
    $elm.on('mousedown',function(evt){
        dragging = true;
    });
    $elm.on('mousemove',function(evt){
        if(!dragging) return;
        var clientX = evt.clientX,clientY = evt.clientY;
        var offsetX = evt.offsetX,offsetY = evt.offsetY;
        var elmWidth =$(this).width(),elmHeight = $(this).height();
        var winX = $(window).width(),winY = $(window).height();
        log('elmWidth',elmWidth,'elmHeight',elmHeight);
        log('offsetX',offsetX,'offsetY',offsetY);
        $(this).css({
            bottom:winY - clientY - elmHeight / 2,
            right:winX - clientX - elmWidth / 2,
        });
        log('move',evt);
    });
    $elm.on('mouseup',function(evt){
        dragging = false;
    });
}
/**
 * 切换菜单图标
 */
function toggleMenu(){
    var imgElm = _$imgAss.get(0);
    if(imgElm.src === _src.comicGrey){
        imgElm.src = _src.comic;
    }else{
        imgElm.src = _src.comicGrey;
    }
    _$imgExport.toggle();
    _$imgToggle.toggle();    
}
/**
 * 收藏或取消收藏
 * wayFlag 获取方式
 */
function toggleFav(storObj, getCurIndex, getChapterInfo,wayFlag) {
    var baseImgUrl = storObj.baseImg,
        baseIndexUrl = storObj.baseIndex,
        baseChapterUrl = storObj.baseChapter;
    // var tmpObj = getCurIndex();

    return function(favs, allFavs) {
        var handle = function (indexObj) {
            var title = indexObj.title,
                indexUrl = indexObj.indexUrl,
                curUrl = indexObj.curUrl,
                curChapter = indexObj.curChapter;
            var index = arrEqStr(favs, {title:title});
            //已经收藏，则取消收藏
            if (index >= 0) {
                var item = favs[index];
                decUpdateNum(item);
                favs.splice(index, 1);
                storLocal.set({
                    [STOR_KEY_FAVS]: allFavs
                });
                _$imgToggle.attr('src',_src.collectGrey);
                showTips('取消收藏成功');
                //通知全部tab页面更新图标
                sendMsg(null,[BG_CMD_UPDATE_FAV_BTN]);
                return;
            }
            //未收藏，则收藏
            var sucCall = function(text) {
                //获取章节与图片信息
                var obj = getChapterInfo(text);
                curChapter = curChapter ? curChapter : obj.curChapter;
                curUrl = curUrl ? curUrl : obj.curUrl;
                var imgUrl = obj.imgUrl ? obj.imgUrl : '';
                var col = {
                    imgUrl: imgUrl.replace(baseImgUrl, ''),
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
                    [STOR_KEY_FAVS]: allFavs
                });
                //通知全部tab页面更新图标
                sendMsg(null,[BG_CMD_UPDATE_FAV_BTN]);
                _$imgToggle.attr('src',_src.collect);
                showTips('收藏成功');

            };
            getIndexContentByFrame(indexUrl,wayFlag,sucCall);
        };
        if(typeof wayFlag === 'object') getCurIndex(handle);
        else handle(getCurIndex());
    }
}