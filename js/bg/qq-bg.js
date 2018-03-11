/**
 * 查询收藏的腾讯漫画是否有更新
 */
var createQqQuery = function() {
    var baseObj = {
        baseIndex: 'http://ac.qq.com/Comic/comicInfo/id/',
        baseImage: 'https://manhua.qpic.cn/vertical/',
        baseChapter: 'http://ac.qq.com/ComicView/index/id/'
    };
    var ajaxCall = function(data) {
        var $html = $(data);
        var baseChapter = 'http://ac.qq.com/ComicView/index/id/';
        var $as = $html.find('.chapter-page-all a');
        var newA = $as.get($as.length - 1);
        var tmpArr = newA.title.split('：');
        var newChapter = tmpArr[1];
        var newUrl = newA.href;
        newUrl = replaceOrigin(newUrl,'http://ac.qq.com');
        newUrl = newUrl.replace(baseChapter,'');
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
    qqQuery = function(){
        getFavs('ac.qq', {}, queryUpdate(baseObj, ajaxCall));
    };
    qqQuery.afterStore = afterStore;
    return qqQuery;
}

/**
 * 腾讯动漫导出用户的收藏
 */
function qqExport(args) {
    var dataStr = args[2];
    var userCols = JSON.parse(dataStr).data;
    var origin = args[1],
        baseImgUrl = 'https://manhua.qpic.cn/vertical/',
        baseChapterUrl = origin + '/ComicView/index/id/',
        baseIndexUrl = origin + '/Comic/comicInfo/id/';

    var storObj = {
        baseImg: baseImgUrl,
        baseIndex: baseIndexUrl,
        baseChapter: baseChapterUrl,
        origin: origin,
        site: 'ac.qq'
    };
    var indexCall = function(item,curSeqNo,baseChapter){
        return function(text){
            $html = $(text);
            var $as = $html.find('.chapter-page-all a');
            var newA = $as.get($as.length - 1),curA = $as.get(curSeqNo);
            var tmpArr = newA.title.split('：');
            var newChapter,curChapter;
            newChapter = tmpArr[1];
            tmpArr = curA.title.split('：');
            curChapter = tmpArr[1];
            var newUrl = newA.href,curUrl = curA.href;
            newUrl = replaceOrigin(newUrl,'http://ac.qq.com').replace(baseChapter,'');
            curUrl = replaceOrigin(curUrl,'http://ac.qq.com').replace(baseChapter,'');
            item.newChapter = newChapter;
            item.curChapter = curChapter;
            item.newUrl = newUrl;
            item.curUrl = curUrl;
        }
    };
    getFavs('ac.qq', storObj, function(cols, allFavs) {
        for (var i = 0, len = userCols.length; i < len; i++) {
            var item = userCols[i];
            var index = arrInStr(cols, item.title, 'title');
            //当收藏中没有该漫画时才添加
            if (index < 0) {
                var col = {
                    imgUrl: item.coverUrl.replace(baseImgUrl, ''),
                    indexUrl: item.id,
                    title: item.title,
                    isUpdate: false
                };
                $.ajax(baseIndexUrl+col.indexUrl,{
                    success:indexCall(col,item.nextSeqNo,storObj.baseChapter),
                    async:false
                });
                cols.push(col);
            }
            storLocal.set({
                allFavs: allFavs
            });
        }
    });
}