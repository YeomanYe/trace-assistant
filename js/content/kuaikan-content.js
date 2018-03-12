/*var img = new Image();
img.setAttribute('style','position:fixed;bottom:20px;width:80px;right:20px;z-index:999');
document.body.appendChild(img);*/
var log = console.log;
$(function() {
    if(curHref.indexOf('kuaikanmanhua.com/web')<0) return;
    createBtn();
    _$imgExport.on('click', function() {
        sendMsg(null, 'exportCollect@-@' + location.origin,handleResData);
    });
    _$imgToggle.on('click', toggleFavBtnHandlerKk);
    updateKk();
});

/**
 * 更新
 */
function updateKk() {
    getFavs('kuaikan', storObj, updateColRecord(getCurComicKk));
}
/**
 * 切换收藏
 */
function toggleFavBtnHandlerKk() {
    var curComic = getCurComicKk();
    getFavs('kuaikan',storObj,toggleFavKk(curComic.title, curComic.indexUrl, curComic.curChapter, curComic.curUrl));
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
/**
 * 添加或取消收藏
 */
function toggleFavKk(title, indexUrl, curChapter, curUrl) {
    return function(kuaikanFavs,allFavs) {
        var index = arrInStr(kuaikanFavs, title, 'title');
        //当前漫画已经在收藏的目录中，取消收藏
        if (index >= 0) {
            kuaikanFavs.splice(index, 1);
            storLocal.set({
                allFavs: allFavs
            });
            showTips('取消收藏成功');
            return;
        }
        //当前漫画不在收藏目录中，收藏进该漫画
        var favItem;
        var indexSuccess = function(text) {
            var $html = $(text);
            var $as = $html.find('table .tit a');
            var newA = $as.get(0);
            var curA = $as.get($as.length - 1);
            curChapter = curChapter ? curChapter : curA.title;
            curUrl = curUrl ? curUrl : curA.href;
            favItem = {
                indexUrl: indexUrl.replace(baseIndexUrl, ''),
                newUrl: newA.href.replace(baseChapterUrl, ''),
                curUrl: curUrl.replace(baseChapterUrl, ''),
                newChapter: newA.title,
                curChapter: curChapter,
                title: title,
                isUpdate: false,
            };
        };
        var querySuccess = function(text) {
            var $html = $(text);
            var $img = $html.find('.search-result .clearfix .comic-img .kk-img');
            var imgUrl = $img.get(0).src
            favItem.imgUrl = imgUrl.replace(baseImgUrl, '');
            kuaikanFavs.unshift(favItem);
            log('allFavs', allFavs);
            storLocal.set({
                allFavs: allFavs
            });
            showTips('收藏成功');
        };
        $.ajax(indexUrl, {
            success: indexSuccess,
            async: false
        });
        $.ajax('http://www.kuaikanmanhua.com/', {
            async: false,
            success: querySuccess,
            type: 'POST',
            data: {
                keyword: title,
                button: '搜索'
            },
        });
    }
}