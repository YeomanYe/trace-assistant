var _allFavs; //全部收藏的漫画集合
var _includeArr = ['kuaikan']; //当URL匹配字符串时才调用
var storLocal = chrome.storage.local;
var $_imgAss;
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
    $_imgAss = $('<img>');
    $_imgAss.addClass('fab-img');
    $_imgAss.get(0).src = chrome.runtime.getURL('images/comic.png');
    $('body').append($_imgAss);
});