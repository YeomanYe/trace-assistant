var _allFavs; //全部收藏的漫画集合
var _includeArr = ['kuaikan']; //当URL匹配字符串时才调用
var storSync = chrome.storage.sync;
var $_imgAss;
$(function() {
    var origin = location.origin;
    if(arrInStr(_includeArr,origin)<0) return;
    $_imgAss = $('<img>');
    $_imgAss.addClass('fab-img');
    $_imgAss.get(0).src = chrome.runtime.getURL('images/comic.png');
    $('body').append($_imgAss);
    //获取收藏的漫画集合
    storSync.get('allFavs',function(storObj){
        _allFavs = storObj.allFavs;
    });
});