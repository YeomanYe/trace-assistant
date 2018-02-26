var storSync = chrome.storage.sync;
var log = console.log;
storSync.get('kukuCol',function(resObj){
    log(resObj);
    resObj = resObj.kukuCol;
    var baseImg = resObj.baseImg,
        baseIndex = resObj.baseIndex,
        cols = resObj.cols;
    log(baseImg,baseIndex);
    cols.forEach(function(obj){
        liTempStr = $('#listItemTemplate').html();
        $liInstance = $(liTempStr);
        $liInstance.find('img')[0].src = baseImg + obj.imgUrl;
        $liInstance.find('.right h3').text(obj.title);
        $liInstance.find('.right .news').text(obj.latestChapter);
        // $liInstance.find('.right .current').text(obj.latestChapter);
        log($liInstance);
        $('.list').append($liInstance);
    });
        

});