
$(function(){
    if(curHref.indexOf('ac.qq.com/Comic') < 0)return;
    log(SITE_QQ);
    createBtn();
    _$imgExport.on('click',exportUserColQq);
    _$imgToggle.on('click',toggleFavHandlerQq);
    _updateCurFavFun = updateQq;
    updateQq();
});
/**
 * 导出腾讯动漫用户配置
 */
function exportUserColQq(){
    $.ajax('http://ac.qq.com/MyPersonalCenter/getUserCollection',{success:function(text){
        var msgArr = [BG_CMD_EXPORT,location.origin,TYPE_COMIC,text];
        sendMsg(null, msgArr,handleResData);
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
    getFavs(SITE_QQ,TYPE_COMIC,updateColRecord(getCurComicQq));
}
/**
 * 切换收藏按钮点击处理函数
 */
function toggleFavHandlerQq(){
    var getChapterInfo = function(text){
        var $html = $(text);
        var imgUrl = $html.find('.works-cover img').get(0).src;
        var $as = $html.find('.chapter-page-all a');
        var newA = $as.get($as.length - 1),curA = $as.get(0);
        var tmpArr = newA.title.split('：');
        var newChapter,newUrl;
        newChapter = tmpArr[1];
        newUrl = newA.href;
        tmpArr = curA.title.split('：');
        curChapter = tmpArr[1];
        curUrl = curA.href;
        var retObj = {
            curUrl:curUrl,
            curChapter:curChapter,
            newUrl:newUrl,
            newChapter:newChapter,
            imgUrl:imgUrl
        };
        return retObj;
    };

    getFavs(SITE_QQ,TYPE_COMIC,toggleFav(storObj,getCurComicQq,getChapterInfo));
}