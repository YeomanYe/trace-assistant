$(function() {
    if (curHref.search(/book.qidian.com\/info\/.+/) >=0 || curHref.search(/read.qidian.com\/chapter\/.+/) >= 0 || curHref.search(/vipreader.qidian.com\/chapter\/.+/) >= 0 ){
        createBtn();
        _$imgExport.on('click', function() {
            showTips('该网站导出功能只能在 https://my.qidian.com/bookcase 网页上使用');
        });
        _$imgToggle.on('click', toggleHandlerQidian);
        updateQidian();
    }else if(curHref === 'https://my.qidian.com/bookcase'){
        createBtn();
        _$imgExport.on('click', exportQidian);
    }
});

/**
 * 导出起点收藏的小说
 */
function exportQidian() {
    var $as = $('#shelfTable .shelf-table-name b a').not('.fen-category');
    var arr = [];
    for(var i=0,len=$as.length;i<len;i++){
        var aElm = $as.get(i);
        arr.push({
            title:aElm.innerText,
            indexUrl:aElm.href.replace(baseIndexUrl,'')
        });
    }
    var extra = {
        datas:arr,
        site:SITE_QIDIAN,
        type:TYPE_FICTION
    };
    var msgArr = [BG_CMD_EXPORT,location.origin,TYPE_FICTION,extra];
    sendMsg(null, msgArr, handleResData(updateQidian));
}
/**
 * 更新
 */
function updateQidian() {
    getFavs(SITE_QIDIAN, TYPE_FICTION, updateColRecord(getCuIndexQidian));
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
        var aElm = $('.crumbs-nav .act').get(0);
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