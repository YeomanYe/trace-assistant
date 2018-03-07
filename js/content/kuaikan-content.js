/*var img = new Image();
img.setAttribute('style','position:fixed;bottom:20px;width:80px;right:20px;z-index:999');
document.body.appendChild(img);*/
var log = console.log;
$(function() {
    _$imgExport.on('click', function() {
        sendMsg(null, 'exportCollect-' + location.origin);
    });
    _$imgToggle.on('click', toggleFavBtnHandler);
    //等待本地收藏的集合获取到
    setTimeout(update, 1000);
});

if (location.href.indexOf('kuaikan') >= 0) {
    var origin = location.origin,
        baseImgUrl = 'https://i1s.kkmh.com/image',
        baseChapterUrl = origin + '/web/comic/',
        baseIndexUrl = origin + '/web/topic';

    var storObj = {
        baseImg: baseImgUrl,
        baseIndex: baseIndexUrl,
        baseChapter: baseChapterUrl,
        origin: origin,
        site: 'kuaikan'
    };
}
/**
 * 更新收藏的漫画的阅读记录
 */
function updateColRecord(kuaikanFavs,allFavs) {
    var href = location.href;
    if (href.indexOf('comic') < 0) return;
    var $as = $('#main h2 .ico a');
    if ($as.length < 1) return;
    var aElm = $as.get(1);
    var indexUrl = aElm.href,
        title = aElm.title;
    log('title', title, 'indexUrl', indexUrl);
    //解析当前页面并更新阅读记录
    var index = arrInStr(kuaikanFavs, title, 'title');
    if (index < 0) return;
    var curItem = kuaikanFavs[index];
    var curChapter = $('#main h2 .ico').html().replace(/.*\<\/span>/, '').trim();
    curItem.curChapter = curChapter;
    curItem.curUrl = href.replace(baseChapterUrl, '');
    decUpdateNum(curItem);
    storLocal.set({allFavs:allFavs});
}
/**
 * 更新
 */
function update() {
    log('_allFavs', _allFavs);
    updateFavIcon();
    getFavs('kuaikan', storObj, updateColRecord);
}
/**
 * 切换收藏
 */
function toggleFavBtnHandler() {
    var curComic = getCurComic();
    getFavs('kuaikan',storObj,toggleFav(curComic.title, curComic.indexUrl, curComic.curChapter, curComic.curUrl));
}
/**
 * 如果当前漫画已被收藏则图标为黄色否则为灰色
 */
function updateFavIcon() {
    // log('getCurComic', obj);
    // var favs = getKuaikanFavs();
    getFavs('kuaikan',storObj,function(favs){
        var obj = getCurComic();
        var index = arrInStr(favs, obj.title, 'title');
        if (index >= 0) _$imgToggle.get(0).src = _src.collect;
    });
    
}
/**
 * 漫画页或目录页获取漫画名称及目录地址
 * 如果是漫画页，获取当前章节和URL
 */
function getCurComic() {
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
function toggleFav(title, indexUrl, curChapter, curUrl) {
    return function(kuaikanFavs,allFavs) {
        var index = arrInStr(kuaikanFavs, title, 'title');
        //当前漫画已经在收藏的目录中，取消收藏
        if (index >= 0) {
            kuaikanFavs.splice(index, 1);
            storLocal.set({
                allFavs: allFavs
            });
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
            kuaikanFavs.push(favItem);
            log('allFavs', allFavs);
            storLocal.set({
                allFavs: allFavs
            });
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