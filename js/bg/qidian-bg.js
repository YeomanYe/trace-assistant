/**
 * 查询收藏的起点小说是否有更新
 */
_createQueryObj.createQidianQuery = function() {
    var baseObj = getBaseStoreObj(SITE_QIDIAN,TYPE_FICTION);
    var ajaxCall = function(data) {
        var $html = $(data);
        var $as = $html.find('#j-catalogWrap .cf a');
        var newA = $as.get($as.length - 1);
        var newChapter,newUrl;
        newChapter = newA.innerText;
        newUrl = newA.href;
        var resObj = {
            newUrl: newUrl,
            newChapter: newChapter
        };
        return resObj;
    };

    var qidianQuery = function() {
        getFavs(SITE_QIDIAN, TYPE_FICTION, queryUpdate(baseObj, ajaxCall));
    };

    this.addAfterStore(qidianQuery, ajaxCall);
    return qidianQuery;
};

/**
 * 起点导出用户的收藏
 */
_exportFunObj[SITE_QIDIAN+'-'+TYPE_FICTION] = function(args, resSend) {
    var dataArg = args[3];
    log('dataArg',dataArg);
    var handleData = function(text, resSend,data) {
        var retObj;
        try {
            var $html = $(text);
            var imgUrl = $html.find('#bookImg img').attr('src');
            var $as = $html.find('#j-catalogWrap .cf a');
            var newA = $as.get($as.length - 1),curA = $as.get(0);
            var newChapter,newUrl;
            newChapter = newA.innerText;
            newUrl = newA.href.replace('chrome-extension','https');
            curChapter = curA.innerText;
            curUrl = curA.href.replace('chrome-extension','https');
            retObj = {
                status:STATUS_OK,
                curUrl:curUrl,
                curChapter:curChapter,
                newUrl:newUrl,
                newChapter:newChapter,
                imgUrl:imgUrl,
                title:data.title
            };
            return retObj;
        }catch(e){
            log(e);
            retObj = {status:STATUS_EXPORT_FAIL,msg:data.title};
        }
        return retObj;
    };
    pipeExport(dataArg, handleData, resSend);
};