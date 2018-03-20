$(function(){
    if(curHref.indexOf('bangumi/play') < 0 && curHref.indexOf('bangumi/media') < 0)return;
    log(SITE_BILIBILI);
    createBtn();
    _$imgExport.on('click',exportUserColBilibili);
    _$imgToggle.on('click',toggleFavBilibili);
    updateBilibili();
});

/**
 * 获取目录连接和标题
 * @returns {*}
 */
function getCurIndexBilibili() {
    var retObj;
    var title;
    if(curHref.indexOf('bangumi/media')>=0){
        retObj = {
            indexUrl:curHref,
            title:$('#app .media-info-title-t').text()
        }
    }else{
        var curUrl = curHref,curChapter;
        var tmpArr = $('#app .header-info h1').text().split('：');
        curChapter = tmpArr[1];
        title = tmpArr[0];
        var indexElm = $('#bangumi_detail .info-title a').get(0);
        if(indexElm)
        retObj = {
            title:title,
            curUrl:curUrl,
            curChapter:curChapter,
            indexUrl:indexElm.href
        }
    }
    return retObj;
}

/**
 * 导出腾讯动漫用户配置
 */
function exportUserColBilibili(){
    $.ajax('http://ac.qq.com/MyPersonalCenter/getUserCollection',{success:function(text){
        var msgArr = ['exportCollect',location.origin,TYPE_COMIC,text];
        sendMsg(null, msgArr,handleResData(updateQq));
    }});
}
/**
 * 更新收藏
 */
function updateBilibili(){
    getFavs(SITE_BILIBILI,TYPE_VIDEO,updateColRecord(getCurIndexBilibili));
}
/**
 * 切换收藏按钮点击处理函数
 */
function toggleFavBilibili(){
    var getChapterInfo = function(text){
        var imgUrl = $('#bangumi_detail .info-cover img').attr('src');
        if(!imgUrl){
            imgUrl = $('#app .media-preview img').attr('src');
        }
        var jsonStr = text.match(/window.__INITIAL_STATE__=({[\S\s]+});/)[1];
        var jsonData = JSON.parse(jsonStr);
        log('initJsonData',jsonData);
        var curUrl,curChapter,newUrl,newChapter,base = 'https://www.bilibili.com/bangumi/play/ep';
        var episodes = jsonData.mediaInfo.episodes;
        var tmp;
        tmp = episodes[0];
        curUrl =  base + tmp.ep_id;
        curChapter = '第'+ tmp.index + '话 ' + tmp.index_title;
        tmp = episodes[episodes.length - 1];
        newUrl = base + tmp.ep_id;
        newChapter = '第'+ tmp.index + '话 ' + tmp.index_title;
        var retObj = {
            curUrl:curUrl,
            curChapter:curChapter,
            newUrl:newUrl,
            newChapter:newChapter,
            imgUrl:imgUrl
        };
        return retObj;
    };

    getFavs(SITE_BILIBILI,TYPE_VIDEO,toggleFav(storObj,getCurIndexBilibili,getChapterInfo,true));
}