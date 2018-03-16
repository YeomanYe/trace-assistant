$(function() {
    if (curHref.search(/book.qidian.com\/info\/.+/) || curHref.search(/read.qidian.com\/chapter\/.+/) ) return;
    createBtn();
    _$imgExport.on('click', function() {
        sendMsg(null, 'exportCollect@-@' + location.origin, handleResData);
    });
    _$imgToggle.on('click', toggleHandlerKk);
    updateKk();
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
function toggleHandlerKk() {
    var getChapterInfo = function(text) {
        var $html = $(text);
        var $as = $html.find('table .tit a');
        var title = $html.find('.comic-name').text();
        var newA = $as.get(0);
        var curA = $as.get($as.length - 1);
        var retObj = {
            newUrl: newA.href,
            curUrl: curA.href,
            newChapter: newA.title,
            curChapter: curA.title,
        };
        var imgQuerySuccess = function(text) {
            var $html = $(text);
            var $img = $html.find('.search-result .clearfix .comic-img .kk-img');
            var imgUrl = $img.get(0).src
            retObj.imgUrl = imgUrl;
        };
        $.ajax('http://www.kuaikanmanhua.com/', {
            async: false,
            success: imgQuerySuccess,
            type: 'POST',
            data: {
                keyword: title,
                button: '搜索'
            },
        });
        return retObj;
    };
    getFavs('ac.qq', TYPE_COMIC, toggleFav(storObj, getCurComicKk, getChapterInfo));
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