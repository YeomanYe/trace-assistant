/**
 * 动漫之家导出用户收藏
 */
function dmzjExport(args,resSend) {
    var htmlText = args[2];

    var origin = 'https://www.dmzj.com',
        baseImgUrl = 'https://images.dmzj.com/img/webpic/',
        baseChapterUrl = origin + '/view/',
        baseIndexUrl = origin + '/info/';

    var w3dmzjStorObj = {
        baseImg: baseImgUrl,
        baseIndex: baseIndexUrl,
        baseChapter: baseChapterUrl,
        origin: origin,
        site: 'www.dmzj'
    };

    origin = 'https://manhua.dmzj.com';
    baseImgUrl = 'https://images.dmzj.com/webpic/';
    baseChapterUrl = origin;
    baseIndexUrl = origin;

    var mhdmzjStorObj = {
        baseImg: baseImgUrl,
        baseIndex: baseIndexUrl,
        baseChapter: baseChapterUrl,
        origin: origin,
        site: 'manhua.dmzj'
    };

    var w3dmzjIndexCall = function(indexUrl, storObj, favs, allFavs) {
        return function(text) {
            $html = $(text);
            var $as = $html.find('.tab-content-selected .list_con_li a');
            var title = $html.find('.comic_deCon h1 a').text();
            var index = arrInStr(favs, title, 'title');
            if (index > 0) return;
            var imgUrl = $html.find('.comic_i_img img').get(0).src;
            var baseChapter = storObj.baseChapter,
                baseImg = storObj.baseImg,
                baseIndex = storObj.baseIndex;
            var newA = $as.get(0),
                curA = $as.get($as.length - 1);
            var newChapter, newUrl, curUrl, curChapter;
            imgUrl = imgUrl.replace(baseImg, '');
            newChapter = newA.innerText;
            newUrl = newA.href;
            newUrl = replaceOrigin(newUrl, storObj.origin).replace(baseChapter, '');
            curChapter = curA.innerText;
            curUrl = curA.href;
            curUrl = replaceOrigin(curUrl, storObj.origin).replace(baseChapter, '');
            var colItem = {
                newUrl: newUrl,
                newChapter: newChapter,
                curChapter: curChapter,
                curUrl: curUrl,
                title: title,
                imgUrl: imgUrl,
                isUpdate: false,
                indexUrl: indexUrl.replace(baseIndex, '')
            };
            favs.unshift(colItem);
            storeDebounce({allFavs:allFavs});
        }
    };
    var mhdmzjIndexCall = function(indexUrl, storObj, favs, allFavs) {
        return function(text) {
            $html = $(text);
            var $as = $html.find('.cartoon_online_border li a');
            var title = $html.find('.odd_anim_title_m h1').text();
            var index = arrInStr(favs, title, 'title');
            if (index > 0) return;
            var imgUrl = $html.find('.anim_intro_ptext img').get(0).src;
            var baseChapter = storObj.baseChapter,
                baseImg = storObj.baseImg,
                baseIndex = storObj.baseIndex;
            var newA = $as.get($as.length - 1),
                curA = $as.get(0);
            var newChapter, newUrl, curUrl, curChapter;
            imgUrl = imgUrl.replace(baseImg, '');
            newChapter = newA.innerText;
            newUrl = newA.href;
            newUrl = replaceOrigin(newUrl, storObj.origin).replace(baseChapter, '');
            curChapter = curA.innerText;
            curUrl = curA.href;
            curUrl = replaceOrigin(curUrl, storObj.origin).replace(baseChapter, '');
            var colItem = {
                newUrl: newUrl,
                newChapter: newChapter,
                curChapter: curChapter,
                curUrl: curUrl,
                title: title,
                imgUrl: imgUrl,
                isUpdate: false,
                indexUrl: indexUrl.replace(baseIndex, '')
            };
            favs.unshift(colItem);
            storeDebounce({allFavs:allFavs});
        }
    };
    getFavs('www.dmzj', w3dmzjStorObj, function(w3dmzjFavs, allFavs) {
        storLocal.set({allFavs:allFavs});
        getFavs('manhua.dmzj', mhdmzjStorObj, function(mhdmzjFavs, allFavs) {
            var index = arrInStr(allFavs,'www.dmzj','site');
            w3dmzjFavs = allFavs[index].cols;
            var $html = $(htmlText);
            var $as = $html.find('.dy_img a');
            for (var i = 0, len = $as.length; i < len; i++) {
                var indexUrl = $as.get(i).href;
                var callback;
                if (indexUrl.indexOf('www.dmzj') >= 0) {
                    callback = w3dmzjIndexCall(indexUrl, w3dmzjStorObj, w3dmzjFavs, allFavs);
                    $.ajax(indexUrl, {
                        success: callback,
                        async: true
                    });
                } else {
                    callback = mhdmzjIndexCall(indexUrl, mhdmzjStorObj, mhdmzjFavs, allFavs)
                    $.ajax(indexUrl, {
                        success: callback,
                        async: true
                    });
                }
            }
            resSend({status:0});
        });
    });
}

/**
 * 查询收藏的动漫之家漫画是否有更新
 */
var createMhdmzjQuery = function() {
    var baseObj = {
        baseIndex: 'https://manhua.dmzj.com',
        baseImage: 'https://images.dmzj.com/webpic/',
        baseChapter: 'https://manhua.dmzj.com'
    };
    var ajaxCall = function(data) {
        var $html = $(data);
        var origin = 'https://manhua.dmzj.com';
        var baseChapter = origin;
        var $as = $html.find('.cartoon_online_border li a');
        var newA = $as.get($as.length - 1);
        var newChapter, newUrl;
        newChapter = newA.innerText;
        newUrl = newA.href;
        newUrl = replaceOrigin(newUrl, origin).replace(baseChapter, '');
        var resObj = {
            newUrl: newUrl,
            newChapter: newChapter
        };
        return resObj;
    };
    var afterStore = function(callback){
        ajaxCall._afterStore = callback;
        return callback;
    };
    mhdmzjQuery = function(){
        getFavs('manhua.dmzj', {}, queryUpdate(baseObj, ajaxCall));
    };
    mhdmzjQuery.afterStore = afterStore;
    return mhdmzjQuery;
}
/**
 * 查询收藏的动漫之家漫画是否有更新
 */
var createW3dmzjQuery = function() {
    var baseObj = {
        baseIndex: 'https://www.dmzj.com/info/',
        baseImage: 'https://images.dmzj.com/img/webpic/',
        baseChapter: 'https://www.dmzj.com/view/'
    };
    var ajaxCall = function(text) {
        var $html = $(text);
        var $as = $html.find('.tab-content-selected .list_con_li a');
        var baseChapter = 'https://www.dmzj.com/view/';
        var newA = $as.get(0);
        var newChapter, newUrl;
        newChapter = newA.innerText;
        newUrl = newA.href;
        newUrl = replaceOrigin(newUrl, 'https://www.dmzj.com').replace(baseChapter, '');
        var resObj = {
            newUrl: newUrl,
            newChapter: newChapter
        };
        return resObj;
    };
    var afterStore = function(callback){
        ajaxCall._afterStore = callback;
        return callback;
    };
    w3dmzjQuery = function(){
        getFavs('www.dmzj', {}, queryUpdate(baseObj, ajaxCall));
    }
    w3dmzjQuery.afterStore = afterStore;
    return w3dmzjQuery;
}