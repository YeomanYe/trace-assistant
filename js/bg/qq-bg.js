/**
 * 查询收藏的腾讯漫画是否有更新
 */
_createQueryObj.createQqQuery = function() {
    var baseObj = getBaseStoreObj(SITE_QQ);
    var ajaxCall = function(data) {
        var $html = $(data);
        var baseChapter = baseObj.baseChapter;
        var $as = $html.find('#chapter .works-chapter-list-wr .chapter-page-all a');
        var newA = $as.get($as.length - 1);
        var newChapter = newA.innerText.trim();
        var newUrl = newA.href;
        newUrl = replaceOrigin(newUrl, baseObj.origin).replace(baseChapter, '');
        var resObj = {
            newUrl: newUrl,
            newChapter: newChapter
        };
        return resObj;
    };

    var qqQuery = function() {
        getFavs(SITE_QQ, TYPE_COMIC, queryUpdate(baseObj, ajaxCall));
    };

    this.setAfterStore(qqQuery, ajaxCall);
    return qqQuery;
}

/**
 * 腾讯动漫导出用户的收藏
 */
_exportFunObj[SITE_QQ+'-'+TYPE_COMIC] = function(args, resSend) {
    var dataStr = args[3];
    var status = JSON.parse(dataStr).status;
    if (status === '-99') {
        resSend({
            status: STATUS_UNAUTH
        });
        return;
    }
    var userCols = JSON.parse(dataStr).data;
    for (var i = 0, len = userCols.length; i < len; i++) {
        userCols[i].indexUrl = userCols[i].id;
    }
    var dataArg = {
        datas:userCols,
        type:TYPE_COMIC,
        site:SITE_QQ
    };
    log('dataArg',dataArg);
    var handleData = function(text, resSend,data) {
        var curSeqNo = data.nextSeqNo;
        var retObj;
        try {
            var $html = $(text);
            var $as = $html.find('#chapter .works-chapter-list-wr .chapter-page-all a');
            curSeqNo = $as.length - 1 < curSeqNo ? $as.length - 1 : curSeqNo;
            var newA = $as.get($as.length - 1),
                curA = $as.get(curSeqNo);
            var tmpArr = newA.title.split('：');
            var newChapter, curChapter;
            newChapter = tmpArr[1];
            tmpArr = curA.title.split('：');
            curChapter = tmpArr[1];
            var newUrl = newA.href,
                curUrl = curA.href;
            var imgUrl = $html.find('.works-cover img').attr('src');
            retObj = {
                status:STATUS_OK,
                newUrl:newUrl,
                curUrl:curUrl,
                newChapter:newChapter,
                curChapter:curChapter,
                title:data.title,
                imgUrl:imgUrl
            }
        }catch(e){
            log(e);
            retObj = {
                status:STATUS_EXPORT_FAIL,
                msg:data.title
            }
        }
        return retObj;
    };
    pipeExport(dataArg, handleData, resSend);
}