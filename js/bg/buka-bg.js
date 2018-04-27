/**
 * 查询收藏是否有更新
 */
_createQueryObj.createBukaQuery = function() {
    var baseObj = getBaseStoreObj(SITE_BUKA);
    var ajaxCall = function(text) {
        var $html = $(text);
        var baseChapter = baseObj.baseChapter;
        var $as = $html.find('#episodes .epsbox-eplink');
        var newA = $as.get($as.length - 1) , curA = $as.get(0);
        var tmpArr1,tmpArr2;
        tmpArr1 = newA.href.split('/');
        tmpArr2 = curA.href.split('/');

        if(parseInt(tmpArr1[tmpArr1.length - 1]) < parseInt(tmpArr2[tmpArr1.length - 1])){
            newA = curA;
        }

        var newChapter, newUrl;
        newChapter = newA.title.split(':')[1];
        newUrl = newA.href;

        var resObj = {
            newUrl: replaceOrigin(newUrl, baseObj.origin).replace(baseChapter, '');,
            newChapter: newChapter
        };
        return resObj;
    };

    var bukaQuery = function() {
        getFavs(SITE_BUKA, TYPE_COMIC, queryUpdate(baseObj, ajaxCall));
    };

    this.addAfterStore(bukaQuery, ajaxCall);
    return bukaQuery;
};