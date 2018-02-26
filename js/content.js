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
        baseImgUrl = '',
        baseIndexUrl = 'http://www.kuaikanmanhua.com/web/topic',
        size = 16;
    if(href.search('kuaikan')<0)return;
    var cols = []; //表示收藏的集合
    //递归遍历，获取所有的收藏结果
    var successCallback = function(resData){
        console.log('resData',resData);
        var datas = resData.data.topics;
        var storDatas = [];
        if(!baseImgUrl){
            //获取url中相同的部分
            if(datas.length>1)
            baseImgUrl = getBaseUrl(datas[0].cover_image_url,datas[1].cover_image_url);
        }
        datas.forEach(function(data){
            storDatas.push({
                imgUrl:data.cover_image_url.replace(baseImgUrl,''),
                indexUrl:'/'+data.id,
                latestChapter:data.latest_comic_title,
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
            'kukuCol':{
                baseImg:baseImgUrl,
                baseIndex:baseIndexUrl,
                cols:cols
            }
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