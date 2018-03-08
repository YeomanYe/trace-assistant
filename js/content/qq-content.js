if (location.href.indexOf('ac.qq') >= 0) {
    var origin = location.origin,
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
}

$(function(){
    if(location.href.indexOf('ac.qq') < 0)return;
    log('ac.qq');
    _$imgExport.on('click',exportUserColQq);
    _$imgToggle.on('click',toggleFavHandlerQq);
    updateQq();
});
/**
 * 导出腾讯动漫用户配置
 */
function exportUserColQq(){
    $.ajax('http://ac.qq.com/MyPersonalCenter/getUserCollection',{success:function(text){
        var userCols = JSON.parse(text).data;
        getFavs('ac.qq',storObj,function(cols,allFavs){
            for(var i=0,len=userCols.length;i<len;i++){
                var item =userCols[i];
                var index = arrInStr(cols,item.title,'title');
                //当收藏中没有该漫画时才添加
                if(index < 0) {
                    var col = {
                        imgUrl: item.coverUrl.replace(baseImgUrl, ''),
                        indexUrl: item.id,
                        newChapter:'第 '+item.lateSeqNo+' 话',
                        curChapter:'第 ' + item.nextSeqNo + ' 话',
                        newUrl: item.id+'/seqno/'+item.lateSeqNo, //最新章节地址
                        curUrl: item.id+'/seqno/'+item.nextSeqNo, //当前章节地址
                        title: item.title,
                        isUpdate: false
                    };
                    cols.push(col);
                }
                storLocal.set({allFavs:allFavs});
            }
        });
    }});
}
/**
 * 获取章节信息
 */
function getCurComicQq(){
    var href = location.origin + location.pathname;
    var $as = $('.chapter-page-all a');
    var retObj;
    if($as.length){
        var title = $('.works-intro-title').text();
        retObj = {
            indexUrl:href,
            title:title
        };
    }else{
        var curUrl = href;
        var aElm = $('#chapter')[0];
        if(aElm){
            var indexUrl = aElm.href;
            var curChapter = $('#comicTitle .title-comicHeading').text();
            title = aElm.title;
            retObj = {
                indexUrl:indexUrl,
                title:title,
                curUrl:curUrl,
                curChapter:curChapter
            }
        }
    }
    return retObj;
}
/**
 * 更新收藏
 */
function updateQq(){
    getFavs('ac.qq',storObj,updateColRecord(getCurComicQq));
}
/**
 * 切换收藏按钮点击处理函数
 */
function toggleFavHandlerQq(){
    var obj = getCurComicQq();
    getFavs('ac.qq',storObj,toggleFavQq(obj.title,obj.indexUrl,obj.curChapter,obj.curUrl));
}
/**
 * 切换收藏
 */
function toggleFavQq(title,indexUrl,curChapter,curUrl){
    return function(qqFavs,allFavs){
        var index = arrInStr(qqFavs,title,'title');
        //已经收藏，则取消收藏
        if(index >= 0){
            qqFavs.splice(index,1);
            storLocal.set({allFavs:allFavs});
            return;
        }
        //未收藏，则收藏
        var sucCall = function(text){
            var $html = $(text);
            var imgUrl = $html.find('.works-cover img').get(0).src;
            var $as = $html.find('.chapter-page-all a');
            var newA = $as.get($as.length - 1),curA = $as.get(0);
            var tmpArr = newA.title.split('：');
            var newChapter,newUrl;
            newChapter = tmpArr[1];
            newUrl = newA.href;
            tmpArr = curA.title.split('：');
            curChapter = curChapter? curChapter : tmpArr[1];
            curUrl = curUrl ? curUrl : curA.href;
            var col = {
                imgUrl: imgUrl.replace(baseImgUrl, ''),
                indexUrl: indexUrl.replace(baseIndexUrl,''),
                newChapter:newChapter,
                curChapter:curChapter,
                newUrl: newUrl.replace(baseChapterUrl,''), //最新章节地址
                curUrl: curUrl.replace(baseChapterUrl,''), //当前章节地址
                title: title,
                isUpdate: false
            };
            qqFavs.push(col);
            storLocal.set({allFavs:allFavs});
        };
        $.ajax(indexUrl,{success:sucCall});
    }
}