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
function getCurComicKuku() {
    var retObj;
    var title;
    if (curHref.search(/comiclist\/[\d]*\/[\d]+/) < 0) {
        //获取漫画名
        title = $('table table table:eq(4) td:eq(0)').text();
        title = title.substring(0, title.length - 2);
        retObj = {
            title: title,
            indexUrl: curHref
        }
    } else {
        var curUrl = curHref;
        var tmpArr = curHref.split('/');
        var indexUrl = tmpArr.splice(0, tmpArr.length - 2).join('/');
        var tdHtmlText = $('table:eq(1) tbody tr:eq(0)').html();
        tmpArr = tdHtmlText.match(/<td [\s\S]*?>([\s\S]*)[\s\S]*<input name/)[1].split('|');
        tmpArr = tmpArr[0].split(' ');
        curChapter = tmpArr.splice(0, tmpArr.length - 1).join(' ');
        //获取标题
        $.ajax(indexUrl, {
            dataType: 'text', async: false,
            beforeSend: function( xhr ) {
                xhr.setRequestHeader('Accept','text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8');
                xhr.setRequestHeader('Accept-Language','zh-CN,zh;q=0.9');
                xhr.setRequestHeader('Content-Type','charset=gbk');
                log('xhr',xhr);
            },
            success: function (text) {
                var $html = $(text);
                title = $html.find('table table table:eq(4) td:eq(0)').text();
                title = title.substring(0, title.length - 2);
            }
        });
        // title = tmpArr.splice(0,tmpArr.length - 2).join(' ');
        retObj = {
            indexUrl: indexUrl,
            title: title,
            curUrl: curUrl,
            curChapter: curChapter
        }
    }
    return retObj;
}

/**
 * 更新收藏
 */
function updateKuku() {
    getFavs(SITE_KUKU, TYPE_COMIC, updateColRecord(getCurComicKuku));
}

/**
 * 切换收藏按钮点击处理函数
 */
function toggleFavHandlerKuku() {
    var getChapterInfo = function (text) {
        var $html = $(text);
        var $as = $html.find('table table table:eq(4) a');
        var newA = $as.get($as.length - 4), curA = $as.get(0);
        var imgUrl = $html.find('table table table img').attr('src');

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

    getFavs(SITE_KUKU, TYPE_COMIC, toggleFav(storObj, getCurComicKuku, getChapterInfo));
}