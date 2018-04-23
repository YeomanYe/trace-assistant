$(function () {
    if (curHref.indexOf('http://www.buka.cn/detail') < 0 && curHref.indexOf('http://www.buka.cn/view') < 0) return;
    log(SITE_BUKA);
    createBtn();
    _$imgExport.on('click', function () {
        showTips('该网站不支持导出功能');
    });
    _$imgToggle.on('click', toggleFavHandlerBuka);
    _updateCurFavFun = updateBuka;
    updateBuka();
});

/**
 * 获取章节信息
 */
function getCurIndexBuka() {
    var retObj;
    var title;
    var indexUrl = curHref;
    if (curHref.search(/buka.cn\/view/) < 0) {
        title = $('.title-font').text().trim()
        //获取漫画名
        retObj = {
            indexUrl: indexUrl,
            title:title
        };
    } else {
        var curUrl = curHref;
        var titleElm = $('.manga-name').get(0);
        title = titleElm.innerText.trim();
        indexUrl = titleElm.href;
        var curChapter = $('#gotoEpisode option:selected').text().trim();

        retObj = {
            indexUrl: indexUrl,
            curUrl: curUrl,
            curChapter: curChapter,
            title:title
        };
    }
    return retObj;
}

/**
 * 更新收藏
 */
function updateBuka() {
    getFavs(SITE_BUKA, TYPE_COMIC, updateColRecord(getCurIndexBuka));
}

/**
 * 切换收藏按钮点击处理函数
 */
function toggleFavHandlerBuka() {
    var getChapterInfo = function (text) {
        var $html = $(text);
        var imgUrl = $html.find('.manga-img img').attr('src');;
        var $as = $html.find('#episodes .epsbox-eplink');

        var newA = $as.get($as.length - 1) , curA = $as.get(0);

        var tmpArr1,tmpArr2;
        tmpArr1 = newA.href.split('/');
        tmpArr2 = curA.href.split('/');

        if(parseInt(tmpArr1[tmpArr1.length - 1]) < parseInt(tmpArr2[tmpArr2.length - 1])){
            var tmp = newA;
            newA = curA;
            curA = tmp;
        }

        var newChapter, newUrl, curChapter, curUrl;
        newChapter = newA.title.split(':')[1];
        newUrl = newA.href;
        curChapter = curA.title.split(':')[1];
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

    getFavs(SITE_BUKA, TYPE_COMIC, toggleFav(storObj, getCurIndexBuka, getChapterInfo));
}