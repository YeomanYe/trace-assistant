$(function() {
    if (curHref.indexOf('kuaikanmanhua.com/web') < 0) return;
    createBtn();
    _$imgExport.on('click', function() {
        var msgArr = ['exportCollect',location.origin,TYPE_COMIC];
        sendMsg(null, msgArr, handleResData(updateKk));
    });
    _$imgToggle.on('click', toggleHandlerKk);
    updateKk();
});

/**
 * 更新
 */
function updateKk() {
    getFavs(SITE_KUAIKAN, TYPE_COMIC, updateColRecord(getCurComicKk));
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
    getFavs(SITE_KUAIKAN, TYPE_COMIC, toggleFav(storObj, getCurComicKk, getChapterInfo));
}

/**
 * 漫画页或目录页获取漫画名称及目录地址
 * 如果是漫画页，获取当前章节和URL
 */
function getCurComicKk() {
    var title = $('body .article-detail-info .comic-name').text();
    var href = location.origin + location.pathname;
    var retObj;
    if (href.indexOf('topic') >= 0) {
        retObj = {
            title: title,
            indexUrl: href,
        };
    } else {
        var aElm = $('#main h2 .ico a').get(1);
        var curUrl = href;
        var curChapter = $('#main h2 .ico').html().replace(/.*\<\/span>/, '').trim();
        if (aElm)
            retObj = {
                title: aElm.title,
                indexUrl: aElm.href,
                curUrl: curUrl,
                curChapter: curChapter
            };
    }
    return retObj
}