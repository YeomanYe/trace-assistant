
$(function(){
    if(curHref.indexOf('cartoonmad.com/comic') < 0)return;
    log(SITE_CARTOONMAD);
    createBtn();
    _$imgExport.on('click',exportUserColCartoonMad);
    _$imgToggle.on('click',toggleFavHandlerCartoonMad);
    _updateCurFavFun = updateCartoonMad;
    updateCartoonMad();
});
/**
 * 导出腾讯动漫用户配置
 */
function exportUserColCartoonMad(){
    showTips('该网站暂不支持导出功能');
}
/**
 * 获取章节信息
 */
function getCurComicCartoonMad(){
    var tmpArr = document.title.split(' - ');
    var title = tmpArr[0];
    title.substr(title.length - 2,2);
    var retObj;
    if(title.substr(title.length - 2,2) !== '漫畫'){
        retObj = {
            indexUrl:curHref,
            title:title
        };
    }else{
        title = title.substr(0,title.length - 2);
        var indexUrl = $('table table center li a:eq(0)').attr('href');
        var curUrl = curHref;
        var curChapter = tmpArr[1];
        retObj = {
            indexUrl:indexUrl,
            title:title,
            curUrl:curUrl,
            curChapter:curChapter
        }
    }
    return retObj;
}
/**
 * 更新收藏
 */
function updateCartoonMad(){
    getFavs(SITE_CARTOONMAD,TYPE_COMIC,updateColRecord(getCurComicCartoonMad));
}
/**
 * 切换收藏按钮点击处理函数
 */
function toggleFavHandlerCartoonMad(){
    var getChapterInfo = function(text){
        var $html = $(text);
        var imgUrl = $html.find('.cover + img').get(0).src;
        var $as = $html.find('fieldset#info legend + table a');
        var newA = $as.get($as.length - 1),curA = $as.get(0);
        var newChapter,newUrl,curChapter,curUrl;
        newChapter = newA.innerText;
        newUrl = newA.href;
        curChapter = curA.innerText;
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

    getFavs(SITE_CARTOONMAD,TYPE_COMIC,toggleFav(storObj,getCurComicCartoonMad,getChapterInfo));
}
