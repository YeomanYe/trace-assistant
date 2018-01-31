/*var img = new Image();
img.setAttribute('style','position:fixed;bottom:20px;width:80px;right:20px;z-index:999');
document.body.appendChild(img);*/
$(function(){
    var $img = $('<img>');
    $img.get(0).src = chrome.runtime.getURL('images/comic.png');
    $img.css({
        position:'fixed',
        bottom:'20px',
        right:'20px',
        width:'80px',
        'z-index':999
    });
    $('body').append($img);
    $img.on('click',fetchUserCol);
});
var storSync = chrome.storage.sync;
function fetchUserCol(){
    var href = location.href;
    var baseUrl = 'http://www.kuaikanmanhua.com/web/fav/topics',
        pageNum = 1,
        size = 16;
    if(href.search('kuaikan')<0)return;
    var cols = []; //表示收藏的集合
    var successCallback = function(resData){
        console.log('resData',resData);
        var datas = resData.data.topics;
        var storDatas = [];
        datas.forEach(function(data){
            storDatas.push({
                imgUrl:data.cover_image_url,
                url:'http://www.kuaikanmanhua.com/web/topic/'+data.id,
                title:data.title
            });
        });
        cols = cols.concat(storDatas);
        if(datas.length == size) {
          ++pageNum;
          var url = baseUrl+'?page='+pageNum+'&size='+size;
          console.log('url',url);
          $.ajax(url,{
            success:successCallback
          });
        }else{
          storSync.set({
            'kukuCol':cols
          });
          storSync.get('kukuCol',function(array){
            console.log(array);
          });
        }
    };
    $.ajax(baseUrl+'?page='+pageNum+'&size='+size,{
        success:successCallback
    });
}