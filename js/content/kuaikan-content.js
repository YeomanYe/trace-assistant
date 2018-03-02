/*var img = new Image();
img.setAttribute('style','position:fixed;bottom:20px;width:80px;right:20px;z-index:999');
document.body.appendChild(img);*/
var log = console.log;
$(function() {
    $_imgAss.on('click', fetchUserCol);
    //等待本地收藏的集合获取到
    setTimeout(updateCol,1000);
});
var storSync = chrome.storage.sync;

function fetchUserCol() {
    var href = location.href;
    var origin = location.origin,
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
                baseImgUrl = getBaseUrl(datas[0].vertical_image_url, datas[1].vertical_image_url);
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
                imgUrl: data.vertical_image_url.replace(baseImgUrl, ''),
                indexUrl: '/' + data.id,
                newUrl: newA.href.replace(origin,''), //最新章节地址
                curUrl: curA.href.replace(origin,''), //当前章节地址
                newChapter: data.latest_comic_title, //最新章节名称
                curChapter: curA.innerText.replace(/\s/g,''), //当前章节名称
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
                origin:origin,
                cols: cols,
                site: 'kuaikan',
            };
            log('storObj',storObj);
            _allFavs = (_allFavs && _allFavs.length > 0) ? _allFavs : [];
            log('_allFavs',_allFavs);
            _allFavs.push(storObj);
            storSync.set({
                'allFavs':_allFavs
            });
            storSync.get('allFavs', function(array) {
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
function updateCol(){
    log('_allFavs',_allFavs);
    var href = location.href;
    if(href.indexOf('kuaikan')<0)return;
    var $as = $('#main h2 .ico a');
    if($as.length<1)return;
    var aElm = $as.get(1);
    var kuaikanFavs,baseChapter;
    for(var i=0,len=_allFavs.length;i<len;i++){
        var item = _allFavs[i];
        if(item.origin.indexOf('kuaikan')>=0){
            baseChapter = item.baseChapter;
            kuaikanFavs = item.cols;
            break;
        }
    }
    if(!kuaikanFavs || kuaikanFavs.length == 0) return;
    var curHref = location.href;
    var index = arrInStr(kuaikanFavs,aElm.href,'indexUrl');
    var curItem = kuaikanFavs[index];
    var curChapter = $('#main h2 .ico').html().replace(/.*\<\/span>/,'').trim();
    curItem.curChapter = curChapter;
    curItem.curUrl = curHref.replace(baseChapter,'');
    storSync.set({
      'allFavs':_allFavs
    });
    log('href',aElm.href);
}