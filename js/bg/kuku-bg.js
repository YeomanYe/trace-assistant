/**
 * 查询收藏的kuku漫画是否有更新
 */
_createQueryObj.createKukuQuery = function() {
    var baseObj = getBaseStoreObj(SITE_KUKU);
    var ajaxCall = function(data) {
        var $html = $(data);
        var baseChapter = baseObj.baseChapter;
        var $as = $html.find('table table:eq(3)').find('tr td a');
        var newA = $as.get($as.length - 4);
        var newChapter,newUrl;
        newChapter = newA.innerText;
        newUrl = newA.href;

        newUrl = replaceOrigin(newUrl, baseObj.origin).replace(baseChapter, '');
        var resObj = {
            newUrl: newUrl,
            newChapter: newChapter
        };
        return resObj;
    };

    var kukuQuery = function() {
        getFavs(SITE_KUKU, TYPE_COMIC, queryUpdate(baseObj, ajaxCall,{originCode:'gbk'}));
    };

    this.addAfterStore(kukuQuery, ajaxCall);
    return kukuQuery;
};
