/**
 * 查询收藏的腾讯漫画是否有更新
 */
_createQueryObj.createBilibiliQuery = function() {
    var baseObj = getBaseStoreObj(SITE_BILIBILI,TYPE_VIDEO);
    var ajaxCall = function(data) {
        var jsonStr = data.match(/window.__INITIAL_STATE__=({[\S\s]+});/)[1];
        var jsonData = JSON.parse(jsonStr);
        log('initJsonData',jsonData);
        var newUrl,newChapter,base = 'https://www.bilibili.com/bangumi/play/ep';
        var episodes = jsonData.mediaInfo.episodes;
        var tmp;
        tmp = episodes[episodes.length - 1];
        newUrl = base + tmp.ep_id;
        newChapter = '第'+ tmp.index + '话 ' + tmp.index_title;
        var resObj = {
            newUrl: newUrl,
            newChapter: newChapter
        };
        return resObj;
    };

    var bilibiliQuery = function() {
        getFavs(SITE_BILIBILI, TYPE_VIDEO, queryUpdate(baseObj, ajaxCall));
    };

    this.addAfterStore(bilibiliQuery, ajaxCall);
    return bilibiliQuery;
};

/**
 * 腾讯动漫导出用户的收藏
 */
_exportFunObj[SITE_BILIBILI+'-'+TYPE_VIDEO] = function(args, resSend) {
    var json = args[3];
    var userCols = json.data.result;
    var storObj = getBaseStoreObj(SITE_BILIBILI,TYPE_VIDEO);
    var ajaxSuc = function (item) {
        return function (text) {
            var $html = $(text);
            var epId = $html.find('.main-inner .v1-bangumi-list-season .cur').data('newest-ep-id');
            item.indexUrl = 'https://www.bilibili.com/bangumi/play/ep' + epId;
        }
    }
    for (var i = 0, len = userCols.length; i < len; i++) {
        var item = userCols[i];
        item.imgUrl = item.cover.replace('http:','').replace(storObj.baseImg,'');
        //获取可以获取到目录页信息的URL
        $.ajax(item.share_url,{success:ajaxSuc(item),async:false});
    }
    var dataArg = {
        datas:userCols,
        type:TYPE_VIDEO,
        site:SITE_BILIBILI
    };
    log('dataArg',dataArg);
    var handleData = function(text, resSend,data) {
        var retObj;
        try {
            var $html = $(text);
            var jsonStr = text.match(/window.__INITIAL_STATE__=({[\S\s]+});/)[1];
            var jsonData = JSON.parse(jsonStr);
            log('initJsonData',jsonData);
            var curUrl,curChapter,newUrl,newChapter,base = 'https://www.bilibili.com/bangumi/play/ep';
            var episodes = jsonData.epList;
            var tmp;
            var indexA = $html.find('#bangumi_detail .info-title a').get(0);
            tmp = episodes[0];
            curUrl =  base + tmp.ep_id;
            curChapter = '第'+ tmp.index + '话 ' + tmp.index_title;
            tmp = episodes[episodes.length - 1];
            newUrl = base + tmp.ep_id;
            newChapter = '第'+ tmp.index + '话 ' + tmp.index_title;
            retObj = {
                status:STATUS_OK,
                curUrl:curUrl,
                title:data.title,
                curChapter:curChapter,
                newUrl:newUrl,
                newChapter:newChapter,
                indexUrl:indexA.href.replace('chrome-extension','https')
            };
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
};