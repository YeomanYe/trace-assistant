var _includeArr = ['kuaikan','dmzj','ac.qq']; //当URL匹配字符串时才调用
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
//创建按钮
function createBtn(){
    var $ul = $('<ul>');
    $ul.addClass('img-list');
    $ul.attr({draggable:true});
    _$imgExport = addImgToUL($ul,_src.exportCollect,null,'导出网站中收藏的漫画到插件中');
    _$imgToggle = addImgToUL($ul,_src.collectGrey,toggleFavIcon,'收藏');
    _$imgAss = addImgToUL($ul,_src.comicGrey,toggleMenu,'切换菜单');
    _$imgExport.toggle();
    _$imgToggle.toggle();
    // setDraggable($ul);
    $('body').append($ul);
}
//给ul列表中加入一个图片
function addImgToUL($ul,srcStr,clickHandler,title){
    $li = $('<li>');
    $img = $('<img>');
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
 * 切换收藏与非收藏图标
 */
function toggleFavIcon(){
    var imgElm = _$imgToggle.get(0);
    if(imgElm.src === _src.collectGrey){
        imgElm.src = _src.collect;
    }else{
        imgElm.src = _src.collectGrey;
    }
}