/**
 * 查询收藏是否有更新
 */
_createQueryObj.createGfQuery = function() {
    var baseObj = getBaseStoreObj(SITE_GF);
    var ajaxCall = function(text) {
        var $html = $(text);
        var baseChapter = baseObj.baseChapter;
        var $as = $html.find('.comic-chapters .chapter-body li a');
        var newA = $as.get($as.length - 1);
        var newChapter,newUrl;
        newChapter = newA.innerText;
        newUrl = newA.href;
        newUrl = replaceOrigin(newUrl, baseObj.origin).replace(baseChapter, '');
        var resObj = {
            newUrl: newUrl,
            newChapter: newChapter+'1'
        };
        return resObj;
    };

    var gfQuery = function() {
        getFavs(SITE_GF, TYPE_COMIC, queryUpdate(baseObj, ajaxCall));
    };

    this.addAfterStore(gfQuery, ajaxCall);
    return gfQuery;
};
