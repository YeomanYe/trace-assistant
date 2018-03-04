var _allFavs; //全部收藏的漫画集合
var _includeArr = ['kuaikan']; //当URL匹配字符串时才调用
var storLocal = chrome.storage.local;
var _$imgAss,_$imgExport,_$imgToggle;
var _updateNum = 0;
var log = console.log;
//获取收藏的漫画集合
storLocal.get('allFavs',function(storObj){
    _allFavs = storObj.allFavs ? storObj.allFavs : [];
});
//获取更新的漫画数量
storLocal.get('updateNum',function(storObj){
    _updateNum = storObj.updateNum;
});
$(function() {
    var origin = location.origin;
    if(arrInStr(_includeArr,origin)<0) return;
    $ul = $('<ul>');
    $ul.addClass('img-list');
    _$imgExport = addImgToUL($ul,'images/comic.png');
    _$imgToggle = addImgToUL($ul,'images/comic.png');
    _$imgAss = addImgToUL($ul,'images/comic.png',toggleImg);
    _$imgExport.toggle();
    _$imgToggle.toggle();
    $('body').append($ul);
});
//给ul列表中加入一个图片
function addImgToUL($ul,srcStr,clickHandler){
    $li = $('<li>');
    $img = $('<img>');
    $img.addClass('fab-img');
    $img.get(0).src = chrome.runtime.getURL(srcStr);
    if(clickHandler) $img.on('click',clickHandler);
    $li.append($img);
    $ul.append($li);
    return $img;
}

function toggleImg(){
    _$imgExport.toggle();
    _$imgToggle.toggle();}