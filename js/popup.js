var storSync = chrome.storage.sync;
var log = console.log;
storSync.get('kukuCol',function(resObj){
    log(resObj);
    resObj = resObj.kukuCol;
    var baseImg = resObj.baseImg,
        baseIndex = resObj.baseIndex,
        baseChapter = resObj.baseChapter,
        origin = resObj.origin,
        cols = resObj.cols;
    log(baseImg,baseIndex);
    cols.forEach(function(obj){
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
        $liInstance.find('.right .delBtn').text('删除');
        $liInstance.find('.right .contBtn').text('继续阅读').attr({
            href:baseChapter + obj.curUrl,
            target:'_blank'
        });
        log($liInstance);
        $('.list').append($liInstance);
    });
});

function getSiteName(site){
    var name;
    if(site.indexOf('kuaikan') >= 0){
        name = '快看漫画';
    }
    return name;
}