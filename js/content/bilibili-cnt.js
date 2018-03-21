$(function(){
    if(curHref.indexOf('bangumi/play') >= 0 || curHref.indexOf('bangumi/media') >= 0){
        log(SITE_BILIBILI);
        createBtn();
        _$imgExport.on('click',function () {
            showTips('该网站使用此功能需要进入用户空间页面(https://space.bilibili.com)');
        });
        _$imgToggle.on('click',toggleFavBilibili);
        updateBilibili();
    }else if(curHref.indexOf('space.bilibili') >= 0){
        createBtn();
        _$imgExport.on('click',exportUserColBilibili);
    }

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
    var userId = location.pathname.match(/\d+/)[0];
    var len = 1,page = 1,sendData,result;
    var baseUrl = 'https://space.bilibili.com/ajax/Bangumi/getList?mid='+userId+'&page=';
    var successCallback = function(resData){
        len = resData.data.pages;
        ++page;
        if(!sendData) {
            result = resData.data.result;
            sendData = resData;
        }else{
            result = result.concat(resData.data.result);
            sendData.data.result = result;
        }
        if(page>len){
            var msgArr = [BG_CMD_EXPORT,location.origin,TYPE_VIDEO,sendData];
            sendMsg(null, msgArr,handleResData());
        }else{
            $.ajax(baseUrl+page,{success:successCallback});
        }
    };
    $.ajax(baseUrl+page,{success:successCallback});
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