var storSync = chrome.storage.sync;
var log = console.log;
storSync.get('kukuCol',function(resObj){
    log(resObj);
    resObj = resObj.kukuCol;
    var baseImg = resObj.baseImg,
        baseIndex = resObj.baseIndex,
        baseChapter = resObj.baseChapter,
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
        $liInstance.find('.right h3 a').text(obj.title).attr({
           href:baseIndex + obj.indexUrl,
           target:'_blank' 
        });
        $liInstance.find('.right .news').text(obj.newChapter).attr({
           href:baseChapter + obj.newUrl,
           target:'_blank'  
        });
        $liInstance.find('.right .current').text(obj.curChapter).attr({
           href:baseChapter + obj.curUrl,
           target:'_blank'  
        });
        log($liInstance);
        $('.list').append($liInstance);
    });
        

});