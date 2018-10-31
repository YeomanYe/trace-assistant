_createQueryObj.createCartoonmadQuery = function() {
    var baseObj = getBaseStoreObj(SITE_CARTOONMAD);
    var ajaxCall = function(data) {
        var $html = $(data);
        var $as = $html.find('fieldset#info legend + table a');
        var newA = $as.get($as.length - 1);
        var newChapter,newUrl;
        newChapter = newA.innerText;
        newUrl = newA.href;

        newUrl = replaceOrigin(newUrl, baseObj.origin).replace(baseObj.baseChapter, '');
        var resObj = {
            newUrl: newUrl,
            newChapter: newChapter
        };
        return resObj;
    };

    var cartoonmadQuery = function() {
        getFavs(SITE_CARTOONMAD, TYPE_COMIC, queryUpdate(baseObj, ajaxCall,{originCode:'big5'}));
    };

    this.addAfterStore(cartoonmadQuery, ajaxCall);
    return cartoonmadQuery;
};
