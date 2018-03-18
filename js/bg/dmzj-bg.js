/**
 * 动漫之家导出用户收藏的漫画
 */
_exportFunObj[SITE_DMZJ+'-'+TYPE_COMIC] = function(args,resSend) {
    var htmlText = args[3];
    var w3dmzjStorObj = getBaseStoreObj(SITE_W3_DMZJ);
    var mhdmzjStorObj = getBaseStoreObj(SITE_MH_DMZJ);

    var w3dmzjIndexCall = function(indexUrl, storObj, favs, allFavs) {
        return function(text) {
            var $html = $(text);
            var $as = $html.find('.tab-content-selected .list_con_li a');
            var title = $html.find('.comic_deCon h1 a').text();
            var index = arrInStr(favs, {title:title});
            if (index > 0) return;
            var imgUrl = $html.find('.comic_i_img img').get(0).src;
            var baseChapter = storObj.baseChapter,
                baseImg = storObj.baseImg,
                baseIndex = 'http://www.dmzj.com/info/';
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
            var $html = $(text);
            var $as = $html.find('.cartoon_online_border li a');
            var title = $html.find('.odd_anim_title_m h1').text();
            var index = arrInStr(favs, {title:title});
            if (index > 0) return;
            var imgUrl = $html.find('.anim_intro_ptext img').get(0).src;
            var baseChapter = storObj.baseChapter,
                baseImg = storObj.baseImg,
                baseIndex = 'http://manhua.dmzj.com';
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
    getFavs(SITE_W3_DMZJ, TYPE_COMIC, function(w3dmzjFavs, allFavs) {
        storLocal.set({allFavs:allFavs});
        getFavs(SITE_MH_DMZJ, TYPE_COMIC, function(mhdmzjFavs, allFavs) {
            var index = arrInStr(allFavs,{site:'www.dmzj',type:TYPE_COMIC});
            w3dmzjFavs = allFavs[index].cols;
            var $html = $(htmlText);
            var $as = $html.find('.dy_img a');
            for (var i = 0, len = $as.length; i < len; i++) {
                var indexUrl = $as.get(i).href;
                var callback;
                if (indexUrl.indexOf(SITE_W3_DMZJ) >= 0) {
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
            resSend({status:STATUS_OK});
        });
    });
}

/**
 * 查询收藏的动漫之家漫画是否有更新
 */
_createQueryObj.createMhdmzjQuery = function() {
    var baseObj = getBaseStoreObj(SITE_MH_DMZJ);
    var ajaxCall = function(data) {
        var $html = $(data);
        var origin = baseObj.origin;
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
    var mhdmzjQuery = function(){
        getFavs(SITE_MH_DMZJ, TYPE_COMIC, queryUpdate(baseObj, ajaxCall));
    };
    this.setAfterStore(mhdmzjQuery,ajaxCall);
    return mhdmzjQuery;
}
/**
 * 查询收藏的动漫之家漫画是否有更新
 */
_createQueryObj.createW3dmzjQuery = function() {
    var baseObj = getBaseStoreObj(SITE_W3_DMZJ);
    var ajaxCall = function(text) {
        var $html = $(text);
        var $as = $html.find('.tab-content-selected .list_con_li a');
        var baseChapter = baseObj.baseChapter;
        var newA = $as.get(0);
        var newChapter, newUrl;
        newChapter = newA.innerText;
        newUrl = newA.href;
        newUrl = replaceOrigin(newUrl, baseObj.origin).replace(baseChapter, '');
        var resObj = {
            newUrl: newUrl,
            newChapter: newChapter
        };
        return resObj;
    };

    var w3dmzjQuery = function(){
        getFavs(SITE_W3_DMZJ, TYPE_COMIC, queryUpdate(baseObj, ajaxCall));
    }
    
    this.setAfterStore(w3dmzjQuery,ajaxCall);
    return w3dmzjQuery;
}