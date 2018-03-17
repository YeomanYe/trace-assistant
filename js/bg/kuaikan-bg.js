/**
 * 查询收藏的快看漫画是否有更新
 */
_createQueryObj.createKuaikanQuery = function() {
    var baseObj = getBaseStoreObj('kuaikan');
    var ajaxCall = function(data) {
        var $html = $(data);
        var aElm = $html.find('table .tit a').get(0);
        var newChapter = aElm.title;
        var tmpArr = aElm.href.split('/');
        var newUrl = tmpArr[tmpArr.length - 2];
        var resObj = {
            newUrl: newUrl,
            newChapter: newChapter
        };
        return resObj;
    };

    var kuaikanQuery = function(){
        getFavs('kuaikan', TYPE_COMIC, queryUpdate(baseObj, ajaxCall));
    };
    
    this.setAfterStore(kuaikanQuery,ajaxCall);
    return kuaikanQuery;
}

/**
 * 快看漫画导出用户的收藏
 */
_exportFunObj['kuaikan-'+TYPE_COMIC] = function(args,resSend) {
    var origin = args[1];
    var kuaikanStorObj = getBaseStoreObj('kuaikan'),
        baseImgUrl = kuaikanStorObj.baseImg,
        baseIndexUrl = kuaikanStorObj.baseIndex;
    var pageNum = 1,
        baseUrl = origin + '/web/fav/topics',
        size = 16;
    getFavs('kuaikan', TYPE_COMIC, function(cols, allFavs) {
        //递归遍历，获取所有的收藏结果
        var successCallback = function(resData) {
            log('resData', resData);
            var status = resData.status_code;
            if(status === 401){
                resSend({status:1});//未登录
                return;
            }
            var datas = resData.data.topics;
            var storDatas = [];
            
            datas.forEach(function(data) {
                var indexCompleteUrl = baseIndexUrl + '/' + data.id;
                var resText = $.ajax(indexCompleteUrl, {
                    async: false
                }).responseText;
                // log('resText',resText);
                $html = $(resText);
                $as = $html.find('.tit a');
                log('$as', $as);
                var newA = $as.get(0),
                    curA = $as.get($as.length - 1);
                //如果数组中有标题和目录链接则说明已经存在该漫画了
                var title = data.title,
                    indexUrl = '/' + data.id;
                if (arrInStr(cols, {title:title}) >= 0) return;
                var tmpArr, newUrl, curUrl;
                tmpArr = newA.href.split('/');
                newUrl = tmpArr[tmpArr.length - 2] + '/';
                tmpArr = curA.href.split('/');
                curUrl = tmpArr[tmpArr.length - 2] + '/';
                storDatas.push({
                    imgUrl: data.vertical_image_url.replace(baseImgUrl, ''),
                    indexUrl: indexUrl,
                    newUrl: newUrl, //最新章节地址
                    curUrl: curUrl, //当前章节地址
                    newChapter: data.latest_comic_title, //最新章节名称
                    curChapter: curA.innerText.replace(/\s/g, ''), //当前章节名称
                    title: title,
                    isUpdate: false
                });
            });
            addArr(cols,storDatas);
            log('storDatas', storDatas);
            if (datas.length === size) {
                ++pageNum;
                var url = baseUrl + '?page=' + pageNum + '&size=' + size;
                log('url', url);
                $.ajax(url, {
                    success: successCallback
                });
            } else {
                kuaikanStorObj.cols = cols;
                log('storObj', kuaikanStorObj);
                log('allFavs', allFavs);
                storLocal.set({
                    'allFavs': allFavs
                });
                resSend({status:0});//导出成功
            }
        };
        $.ajax(baseUrl + '?page=' + pageNum + '&size=' + size, {
            success: successCallback
        });
    });
}