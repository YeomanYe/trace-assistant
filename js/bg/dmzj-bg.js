/**
 * 动漫之家导出用户收藏
 */
_exportFunObj['dmzj'] = function(args,resSend) {
    var htmlText = args[2];
    var w3dmzjStorObj = getBaseStoreObj('www.dmzj');
    var mhdmzjStorObj = getBaseStoreObj('manhua.dmzj');

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
                baseIndex = 'http://www.dmzj.com';
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
    getFavs('www.dmzj', TYPE_COMIC, function(w3dmzjFavs, allFavs) {
        storLocal.set({allFavs:allFavs});
        getFavs('manhua.dmzj', TYPE_COMIC, function(mhdmzjFavs, allFavs) {
            var index = arrInStr(allFavs,['www.dmzj',TYPE_COMIC],['site','type']);
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
_createQueryObj.createMhdmzjQuery = function() {
    var baseObj = getBaseStoreObj('manhua.dmzj');
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
        getFavs('manhua.dmzj', TYPE_COMIC, queryUpdate(baseObj, ajaxCall));
    };
    this.setAfterStore(mhdmzjQuery,ajaxCall);
    return mhdmzjQuery;
}
/**
 * 查询收藏的动漫之家漫画是否有更新
 */
_createQueryObj.createW3dmzjQuery = function() {
    var baseObj = getBaseStoreObj('www.dmzj');
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
        getFavs('www.dmzj', TYPE_COMIC, queryUpdate(baseObj, ajaxCall));
    }
    
    this.setAfterStore(w3dmzjQuery,ajaxCall);
    return w3dmzjQuery;
}