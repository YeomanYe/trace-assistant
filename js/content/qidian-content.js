$(function() {
    if (curHref.search(/book.qidian.com\/info\/.+/) < 0 && curHref.search(/read.qidian.com\/chapter\/.+/) < 0 ) return;
    createBtn();
    _$imgExport.on('click', function() {
        var msgArr = ['exportCollect',location.origin,TYPE_FICTION];
        sendMsg(null, msgArr, handleResData(updateQidian));
    });
    _$imgToggle.on('click', toggleHandlerQidian);
    updateQidian();
});

/**
 * 更新
 */
function updateQidian() {
    getFavs('qidian', TYPE_FICTION, updateColRecord(getCuIndexQidian));
}
/**
 * 收藏或取消收藏
 */
function toggleHandlerQidian() {
    var getChapterInfo = function(text){
        var $html = $(text);
        var imgUrl = $html.find('#bookImg img').attr('src');
        var $as = $html.find('#j-catalogWrap .cf a');
        var newA = $as.get($as.length - 1),curA = $as.get(0);
        var newChapter,newUrl;
        newChapter = newA.innerText;
        newUrl = newA.href;
        curChapter = curA.innerText;
        curUrl = curA.href;
        var retObj = {
            curUrl:curUrl,
            curChapter:curChapter,
            newUrl:newUrl,
            newChapter:newChapter,
            imgUrl:imgUrl
        };
        return retObj;
    };

    getFavs(SITE_QIDIAN,TYPE_FICTION,toggleFav(storObj,getCuIndexQidian,getChapterInfo));
}

function getCuIndexQidian(){
    var title = $('.book-info h1 em').text();
    var retObj;
    if (curHref.indexOf('book.qidian') >= 0) {
        retObj = {
            title: title,
            indexUrl: curHref,
        };
    } else {
        var aElm = $('.crumbs-nav .act').get(1);
        var curUrl = curHref;
        var curChapter = $('#j_chapterBox .j_chapterName').text();
        if (aElm)
            retObj = {
                title: aElm.innerText,
                indexUrl: aElm.href,
                curUrl: curUrl,
                curChapter: curChapter
            };
    }
    return retObj
}