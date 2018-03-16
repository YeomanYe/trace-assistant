/**
 * 查询收藏的腾讯漫画是否有更新
 */
_createQueryObj.createQqQuery = function() {
    var baseObj = getBaseStoreObj('ac.qq');
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
        getFavs('ac.qq', TYPE_COMIC, queryUpdate(baseObj, ajaxCall));
    };

    this.setAfterStore(qqQuery, ajaxCall);
    return qqQuery;
}

/**
 * 腾讯动漫导出用户的收藏
 */
_exportFunObj['ac.qq'] = function(args, resSend) {
    var dataStr = args[2];
    var status = JSON.parse(dataStr).status;
    if (status === '-99') {
        resSend({
            status: 1
        });
        return;
    }
    var userCols = JSON.parse(dataStr).data;
    for (var i = 0, len = userCols.length; i < len; i++) {
        userCols[i].indexUrl = userCols[i].id;
    }
    var dataArg = {
        datas:userCols,
        site:'ac.qq'
    };
    var handleData = function(text, resSend,data) {
        var curSeqNo = data.nextSeqNo;
        var retObj;
        try {
            var $html = $(text);
            var $as = $html.find('#chapter .works-chapter-list-wr .chapter-page-all a');
            var newA = $as.get($as.length - 1),
                curA = $as.get(curSeqNo);
            var tmpArr = newA.title.split('：');
            var newChapter, curChapter;
            newChapter = tmpArr[1];
            tmpArr = curA.title.split('：');
            curChapter = tmpArr[1];
            var newUrl = newA.href,
                curUrl = curA.href;
            var title = $html.find('.works-intro-title').text();
            var imgUrl = $html.find('.works-cover img').attr('src');
            retObj = {
                newUrl:newUrl,
                curUrl:curUrl,
                newChapter:newChapter,
                curChapter:curChapter,
                title:title,
                imgUrl:imgUrl
            }
        }catch(e){
            log(e);
        }
        return retObj;
    };
    pipeExport(dataArg, handleData, resSend);
}