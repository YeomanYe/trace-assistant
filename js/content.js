/*var img = new Image();
img.setAttribute('style','position:fixed;bottom:20px;width:80px;right:20px;z-index:999');
document.body.appendChild(img);*/
var log = console.log;
$(function() {
    var $img = $('<img>');
    $img.get(0).src = chrome.runtime.getURL('images/comic.png');
    $img.css({
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '80px',
        'z-index': 999
    });
    $('body').append($img);
    $img.on('click', fetchUserCol);
});
var storSync = chrome.storage.sync;

function fetchUserCol() {
    var href = location.href;
    var origin = 'http://www.kuaikanmanhua.com',
        baseUrl = origin + '/web/fav/topics',
        pageNum = 1,
        baseImgUrl = '',
        baseIndexUrl = origin + '/web/topic',
        size = 16;
    if (href.search('kuaikan') < 0) return;
    var cols = []; //表示收藏的集合
    //递归遍历，获取所有的收藏结果
    var successCallback = function(resData) {
        log('resData', resData);
        var datas = resData.data.topics;
        var storDatas = [];
        if (!baseImgUrl) {
            //获取url中相同的部分
            if (datas.length > 1)
                baseImgUrl = getBaseUrl(datas[0].cover_image_url, datas[1].cover_image_url);
        }
        datas.forEach(function(data) {
            var indexUrl = baseIndexUrl + '/' + data.id;
            var resText = $.ajax(indexUrl, {
                async: false
            }).responseText;
            // log('resText',resText);
            $html = $(resText);
            $as = $html.find('.tit a');
            log('$as', $as);
            var newA = $as.get(0),
                curA = $as.get($as.length - 1);
            storDatas.push({
                imgUrl: data.cover_image_url.replace(baseImgUrl, ''),
                indexUrl: '/' + data.id,
                newUrl: newA.href.replace(origin,''), //最新章节地址
                curUrl: curA.href.replace(origin,''), //当前章节地址
                newChapter: data.latest_comic_title, //最新章节名称
                curChapter: curA.innerText.replace(/\s/g,''),
                title: data.title
            });
        });
        cols = cols.concat(storDatas);
        if (datas.length == size) {
            ++pageNum;
            var url = baseUrl + '?page=' + pageNum + '&size=' + size;
            log('url', url);
            $.ajax(url, {
                success: successCallback
            });
        } else {
            var storObj = {
                baseImg: baseImgUrl,
                baseIndex: baseIndexUrl,
                baseChapter: origin,
                cols: cols,
                domain: 'kuaikan',
            };
            log('storObj',storObj);
            storSync.set({
                'kukuCol':storObj
            });
            storSync.get('kukuCol', function(array) {
                log(array);
            });
        }
    };
    $.ajax(baseUrl + '?page=' + pageNum + '&size=' + size, {
        success: successCallback
    });
}