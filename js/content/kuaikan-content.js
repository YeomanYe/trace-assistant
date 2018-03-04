/*var img = new Image();
img.setAttribute('style','position:fixed;bottom:20px;width:80px;right:20px;z-index:999');
document.body.appendChild(img);*/
var log = console.log;
$(function() {
    _$imgExport.on('click', exportUserCol);
    _$imgToggle.on('click',toggleFavBtnHandler);
    //等待本地收藏的集合获取到
    setTimeout(updateCol, 1000);
});

if (location.href.indexOf('kuaikan') >= 0) {
    var origin = location.origin,
        baseImgUrl = 'https://i1s.kkmh.com/image',
        baseChapterUrl = origin + '/web/comic/',
        baseIndexUrl = origin + '/web/topic';

    var storObj = {
        baseImg: baseImgUrl,
        baseIndex: baseIndexUrl,
        baseChapter: baseChapterUrl,
        origin: origin,
        site: 'kuaikan'
    };
}
/**
 * 导出用户的收藏
 */
function exportUserCol() {
    var href = location.href;
    var pageNum = 1,
        baseUrl = origin + '/web/fav/topics',
        size = 16;
    if (href.search('kuaikan') < 0) return;
    var cols = getKuaikanFavs(); //表示收藏的集合
    //递归遍历，获取所有的收藏结果
    var successCallback = function(resData) {
        log('resData', resData);
        var datas = resData.data.topics;
        var storDatas = [];
        if (!baseImgUrl) {
            //获取url中相同的部分
            if (datas.length > 1)
                baseImgUrl = getBaseUrl(datas[0].vertical_image_url, datas[1].vertical_image_url);
        }
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
            var title = data.title,indexUrl = '/' + data.id;
            if(arrInStr(cols,title,'title') >= 0 && arrInStr(cols,indexUrl,'indexUrl') >= 0) return;
            storDatas.push({
                imgUrl: data.vertical_image_url.replace(baseImgUrl, ''),
                indexUrl: indexUrl,
                newUrl: newA.href.replace(baseChapterUrl, ''), //最新章节地址
                curUrl: curA.href.replace(baseChapterUrl, ''), //当前章节地址
                newChapter: data.latest_comic_title, //最新章节名称
                curChapter: curA.innerText.replace(/\s/g, ''), //当前章节名称
                title: title,
                isUpdate: false
            });
        });
        cols = cols.concat(storDatas);
        log('storDatas',storDatas);
        if (datas.length === size) {
            ++pageNum;
            var url = baseUrl + '?page=' + pageNum + '&size=' + size;
            log('url', url);
            $.ajax(url, {
                success: successCallback
            });
        } else {
            storObj.cols = cols;
            log('storObj', storObj);
            log('_allFavs', _allFavs);
            storLocal.set({
                'allFavs': _allFavs
            });
            storLocal.get('allFavs', function(array) {
                log(array);
            });
        }
    };
    $.ajax(baseUrl + '?page=' + pageNum + '&size=' + size, {
        success: successCallback
    });
}

/**
 * 更新收藏的漫画
 */
function updateCol() {
    log('_allFavs', _allFavs);
    var href = location.href;
    if (href.indexOf('comic') < 0) return;
    var $as = $('#main h2 .ico a');
    if ($as.length < 1) return;
    var aElm = $as.get(1);
    var kuaikanFavs = getKuaikanFavs();    
    //解析当前页面并更新阅读记录
    var index = arrInStr(kuaikanFavs, aElm.href, 'indexUrl');
    if(index < 0) return;
    var curItem = kuaikanFavs[index];
    var curChapter = $('#main h2 .ico').html().replace(/.*\<\/span>/, '').trim();
    curItem.curChapter = curChapter;
    curItem.curUrl = href.replace(baseChapterUrl, '');
    if (curItem.isUpdate) {
        curItem.isUpdate = false;
        --_updateNum;
        storLocal.set({
            updateNum: _updateNum,
            allFavs: _allFavs
        });
        chrome.runtime.sendMessage(null, 'updateNumChange');
    } else {
        storLocal.set({
            allFavs: _allFavs
        });
    }
}
/**
 * 切换收藏
 */
function toggleFavBtnHandler(){
    var title = $('body .article-detail-info .comic-name').text();
    var href = location.origin + location.pathname;
    if(href.indexOf('topic') >= 0){
        toggleFav(title,href);
    }else{
        var aElm = $('#main h2 .ico a').get(1);
        title = aElm.title;
        var curUrl = href;
        href = aElm.href;
        if(href.indexOf('topic') >= 0){
        var curChapter = $('#main h2 .ico').html().replace(/.*\<\/span>/, '').trim();
        toggleFav(title,href,curChapter,curUrl);
        }
    }
}
/**
 * 添加或取消收藏
 */
function toggleFav(title,indexUrl,curChapter,curUrl){
    var kuaikanFavs = getKuaikanFavs();
    var index = arrInStr(kuaikanFavs,indexUrl,'indexUrl');
    //当前漫画已经在收藏的目录中，取消收藏
    if(index >= 0) {
        kuaikanFavs.splice(index,1);
        storLocal.set({
            allFavs:_allFavs
        });
        return;
    }
    //当前漫画不在收藏目录中，收藏进该漫画
    var favItem;
    var indexSuccess = function(text){
        var $html = $(text);
        var $as = $html.find('table .tit a');
        var newA = $as.get(0);
        var curA = $as.get($as.length - 1);
        curChapter = curChapter ? curChapter : curA.title;
        curUrl = curUrl ? curUrl : curA.href;
        favItem = {
            indexUrl:indexUrl.replace(baseIndexUrl,''),
            newUrl:newA.href.replace(baseChapterUrl,''),
            curUrl:curUrl.replace(baseChapterUrl,''),
            newChapter:newA.title,
            curChapter:curChapter,
            title:title,
            isUpdate:false,
        };
    };
    $.ajax(indexUrl,{
        success:indexSuccess,
        async:false
    });
    var querySuccess = function(text){
        var $html = $(text);
        var $img = $html.find('.search-result .clearfix .comic-img .kk-img');
        var imgUrl = $img.get(0).src
        favItem.imgUrl = imgUrl.replace(baseImgUrl,'');
        kuaikanFavs.push(favItem);
        log('allFavs',_allFavs);
        storLocal.set({
            allFavs:_allFavs
        });
    };
    $.ajax('http://www.kuaikanmanhua.com/',{
        async:false,
        success:querySuccess,
        type:'POST',
        data:{
            keyword:title,
            button:'搜索'
        },
    });

}
/**
 * 获取kuaikan漫画网收藏的集合
 */
function getKuaikanFavs(){
    var index = arrInStr(_allFavs,'kuaikan','site');
    var cols = [];
    if(index < 0){
        storObj.cols = cols;
        _allFavs.push(storObj);
    }else{
        cols = _allFavs[index].cols;
    }
    return cols;
}