$(function () {
    if (curHref.indexOf('kukudm') < 0) return;
    log(SITE_KUKU);
    createBtn();
    _$imgExport.on('click', function () {
        showTips('该网站不支持导出功能');
    });
    _$imgToggle.on('click', toggleFavHandlerKuku);
    _updateCurFavFun = updateKuku;
    updateKuku();
});

/**
 * 获取章节信息
 */
function getCurComicKuku(sucCall) {
    var retObj;
    var title;
    var indexUrl = curHref;
    if (curHref.search(/comiclist\/[\d]*\/[\d]+/) < 0) {
        //获取漫画名
        retObj = {
            indexUrl: indexUrl
        };
    } else {
        var curUrl = curHref;
        var tmpArr = curHref.split('/');
        indexUrl = tmpArr.splice(0, tmpArr.length - 2).join('/');
        var tdHtmlText = $('table:eq(1) tbody tr:eq(0)').html();
        tmpArr = tdHtmlText.match(/<td [\s\S]*?>([\s\S]*)[\s\S]*<input name/)[1].split('|');
        tmpArr = tmpArr[0].split(' ');
        var curChapter = tmpArr.splice(0, tmpArr.length - 1).join(' ');

        retObj = {
            indexUrl: indexUrl,
            curUrl: curUrl,
            curChapter: curChapter
        };
    }
    //获取标题
    var handle = function (text) {
        log(text);
        var $html = $(text);
        title = $html.find('table table:eq(3)').find('tr td').eq(0).text();
        title = title.substring(0, title.length - 2);
        retObj.title = title;

        sucCall(retObj);
    };
    htmlDecodeByFrame(indexUrl,handle);
    return retObj;
}

/**
 * 更新收藏
 */
function updateKuku() {
    getFavs(SITE_KUKU, TYPE_COMIC, updateColRecord(getCurComicKuku,true));
}

/**
 * 切换收藏按钮点击处理函数
 */
function toggleFavHandlerKuku() {
    var getChapterInfo = function (text) {
        var $html = $(text);
        var $as = $html.find('table table:eq(3)').find('tr td a');
        var newA = $as.get($as.length - 4), curA = $as.get(0);
        var imgUrl = $html.find('table table:eq(3)').find('tr td img').attr('src');

        var newChapter, newUrl, curChapter, curUrl;
        newChapter = newA.innerText;
        newUrl = newA.href;
        curChapter = curA.innerText;
        curUrl = curA.href;
        var retObj = {
            curUrl: curUrl,
            curChapter: curChapter,
            newUrl: newUrl,
            newChapter: newChapter,
            imgUrl: imgUrl
        };
        return retObj;
    };

    getFavs(SITE_KUKU, TYPE_COMIC, toggleFav(storObj, getCurComicKuku, getChapterInfo,{originCode:'gbk'}));
}