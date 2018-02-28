var storSync = chrome.storage.sync;
var log = console.log;
var colObjs;
storSync.get('kukuCol',function(resObj){
    log(resObj);
    resObj = resObj.kukuCol;
    colObjs = resObj;
    var baseImg = resObj.baseImg,
        baseIndex = resObj.baseIndex,
        baseChapter = resObj.baseChapter,
        origin = resObj.origin,
        cols = resObj.cols;
    log(baseImg,baseIndex);
    cols.forEach(function(obj,index){
        liTempStr = $('#listItemTemplate').html();
        $liInstance = $(liTempStr);
        $liInstance.find('.left div').css({
            'background-image':'url('+baseImg + obj.imgUrl+')',
            'background-size':'cover',
            'background-repeat':'no-repeat'
        });
        $liInstance.find('.left').attr({
            href:baseIndex + obj.indexUrl,
            target:'_blank'
        });
        $liInstance.find('.middle h3 a').text(obj.title).attr({
           href:baseIndex + obj.indexUrl,
           target:'_blank' 
        });
        $liInstance.find('.middle .news').text('最新：'+obj.newChapter).attr({
           href:baseChapter + obj.newUrl,
           target:'_blank'  
        });
        $liInstance.find('.middle .current').text('看到：'+obj.curChapter).attr({
           href:baseChapter + obj.curUrl,
           target:'_blank'  
        });
        $liInstance.find('.right .source').text(getSiteName(origin)).attr({
            href:origin,
            target:'_blank'
        });
        $liInstance.find('.right .delBtn').text('删除').attr('data-index',''+index).on('click',delCollect);
        $liInstance.find('.right .contBtn').text('继续阅读').attr({
            href:baseChapter + obj.curUrl,
            target:'_blank'
        });
        log($liInstance);
        $('.list').append($liInstance);
    });
});
/**
 * 删除收藏的漫画
 */
function delCollect(e){
    //删除UI
    $(this).parents('li').remove();
    //从本地存储中删除
    var index = $(this).data('index');
    colObjs.cols.splice(index,1);
    log('colObjs',colObjs);
    storSync.set({
      'kukuCol':colObjs
    });
}
/**
 * 根据站点url获得网站名称
 * @param  {string} site 站点url
 */
function getSiteName(site){
    var name;
    if(site.indexOf('kuaikan') >= 0){
        name = '快看漫画';
    }
    return name;
}