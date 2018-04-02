$(function() {
    if (curHref.indexOf('dmzj.com/info') >= 0 || curHref.indexOf('dmzj.com/view/') >= 0) {
        log(SITE_W3_DMZJ);
        createBtn();
        _$imgToggle.on('click', toggleFavHandlerW3dmzj);
        _$imgExport.on('click', showLoginTips);
        _updateCurFavFun = updateW3dmzj;
        updateW3dmzj();
    } else if (curHref.search(/manhua.dmzj.com\/.+/) >= 0) {
        createBtn();
        _$imgToggle.on('click', toggleFavHandlerMhdmzj);
        _$imgExport.on('click', showLoginTips);
        _updateCurFavFun = updateMhdmzj;
        updateMhdmzj();
    } else if (curHref.indexOf('i.dmzj') >= 0 && curHref.indexOf('login') < 0) {
        createBtn();
        _$imgExport.on('click', exportUserColDmzj);
    }

});
/**
 * 显示登录对应页面提示
 */
function showLoginTips(){
    showTips('该网站使用此功能需要进入 https://i.dmzj.com/ 页面');
}
/**
 * 更新收藏
 */
function updateMhdmzj() {
    getFavs(SITE_MH_DMZJ, TYPE_COMIC, updateColRecord(getCurComicMhdmzj));
}
/**
 * 更新收藏
 */
function updateW3dmzj() {
    getFavs(SITE_W3_DMZJ, TYPE_COMIC, updateColRecord(getCurComicW3dmzj));
}
/**
 * 获取当前页面漫画名称、目录地址、章节名称、章节链接
 */
function getCurComicW3dmzj() {
    var href = location.origin + location.pathname;
    var title = $('.comic_deCon h1 a').text();
    var retObj;
    if (title) {
        retObj = {
            title: title,
            indexUrl: href
        };
    } else {
        var curUrl = href;
        var curChapter = $('.head_title h2').text();
        if (curChapter) {
            var indexA = $('.head_wz a').get(1);
            title = indexA.innerText;
            retObj = {
                title: title,
                indexUrl: indexA.href,
                curUrl: curUrl,
                curChapter: curChapter
            };
        }
    }
    return retObj;
}
/**
 * 获取当前页面漫画名称、目录地址、章节名称、章节链接
 */
function getCurComicMhdmzj() {
    var href = location.origin + location.pathname;
    var title = $('.anim_title_text h1').text();
    var retObj;
    if (title) {
        retObj = {
            title: title,
            indexUrl: href
        };
    } else {
        var curUrl = href;
        var curChapter = $('.display_middle span.redhotl').text();
        if (curChapter) {
            var indexA = $('.display_middle a.redhotl').get(0);
            title = indexA.innerText;
            retObj = {
                title: title,
                indexUrl: indexA.href,
                curUrl: curUrl,
                curChapter: curChapter
            };
        }
    }
    return retObj;
}
/**
 * 切换收藏按钮点击处理函数
 */
function toggleFavHandlerW3dmzj() {
    var getChapterInfo = function(text) {
        var $html = $(text);
        var imgUrl = $html.find('.comic_i_img img').get(0).src;
        var $as = $html.find('.tab-content-selected .list_con_li a');
        var newA = $as.get(0),
            curA = $as.get($as.length - 1);
        var newChapter, newUrl;
        newChapter = newA.innerText;
        newUrl = newA.href;
        var retObj = {
            newChapter: newChapter,
            newUrl: newUrl,
            curChapter: curA.innerText,
            curUrl: curA.href,
            imgUrl: imgUrl
        };
        return retObj;
    }
    getFavs(SITE_W3_DMZJ, TYPE_COMIC, toggleFav(storObj, getCurComicW3dmzj, getChapterInfo));

}

/**
 * 切换收藏按钮点击处理函数
 */
function toggleFavHandlerMhdmzj() {
    // var obj = getCurComicMhdmzj();
    var getChapterInfo = function(text) {
        var $html = $(text);
        var imgUrl = $html.find('.anim_intro_ptext img').get(0).src;
        var $as = $html.find('.cartoon_online_border a');
        var newA = $as.get($as.length - 1),
            curA = $as.get(0);
        var newChapter, newUrl;
        newChapter = newA.innerText;
        newUrl = newA.href;
        var retObj = {
            curChapter: curA.innerText,
            curUrl: curA.href,
            newChapter: newChapter,
            newUrl: newUrl,
            imgUrl: imgUrl
        };
        return retObj;
    }
    getFavs(SITE_MH_DMZJ, TYPE_COMIC, toggleFav(storObj, getCurComicMhdmzj, getChapterInfo));
}
/**
 * 导出动漫之家的收藏
 */
function exportUserColDmzj() {
    $.ajax('https://i.dmzj.com/ajax/my/subscribe', {
        success: function(text) {
            var msgArr = [BG_CMD_EXPORT,location.origin,TYPE_COMIC,text];
            sendMsg(null, msgArr,handleResData);
        },
        type:'POST',
        data:'page=1&type_id=1&letter_id=0&read_id=1'
    });
}