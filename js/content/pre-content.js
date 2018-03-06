var _allFavs; //全部收藏的漫画集合
var _includeArr = ['kuaikan','dmzj']; //当URL匹配字符串时才调用
var storLocal = chrome.storage.local;
var _$imgAss,_$imgExport,_$imgToggle;
var _updateNum = 0;
var log = console.log;
var cGetUrl = chrome.runtime.getURL;
var sendMsg = chrome.runtime.sendMessage;
var _src = {
    collect:cGetUrl('images/collect.png'),
    collectGrey:cGetUrl('images/collect-grey.png'),
    exportCollect:cGetUrl('images/export-collect.png'),
    comicGrey:cGetUrl('images/comic-grey.png'),
    comic:cGetUrl('images/comic.png')
};
//初始化存储
storLocal.get(['allFavs','updateNum'],function(storObj){
    _allFavs = storObj.allFavs ? storObj.allFavs : [];
    _updateNum = storObj.updateNum ? storObj.updateNum : 0;
});
$(function() {
    var origin = location.origin;
    if(arrInStr(_includeArr,origin)<0) return;
    $ul = $('<ul>');
    $ul.addClass('img-list');
    _$imgExport = addImgToUL($ul,_src.exportCollect);
    _$imgToggle = addImgToUL($ul,_src.collectGrey,toggleFav);
    _$imgAss = addImgToUL($ul,_src.comicGrey,toggleMenu);
    _$imgExport.toggle();
    _$imgToggle.toggle();
    $('body').append($ul);
});
//给ul列表中加入一个图片
function addImgToUL($ul,srcStr,clickHandler){
    $li = $('<li>');
    $img = $('<img>');
    $img.addClass('fab-img');
    $img.get(0).src = srcStr;
    if(clickHandler) $img.on('click',clickHandler);
    $li.append($img);
    $ul.append($li);
    return $img;
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
function toggleFav(){
    var imgElm = _$imgToggle.get(0);
    if(imgElm.src === _src.collectGrey){
        imgElm.src = _src.collect;
    }else{
        imgElm.src = _src.collectGrey;
    }
}