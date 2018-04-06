
$(function(){
    if(curHref.search(/gufengmh.com\/manhua\/.+/) < 0)return;
    log(SITE_GF);
    createBtn();
    _$imgExport.on('click',function () {
        showTips('暂不支持导出');
    });
    _$imgToggle.on('click',toggleFavHandlerGf);
    _updateCurFavFun = updateGf;
    updateGf();
});
/**
 * 导出用户收藏
 */
function exportUserColGf(){
    
}
/**
 * 获取章节信息
 */
function getCurComicGf(){
    var retObj;
    var title = $('.book-title h1').text();
    if(title){
        retObj = {
            indexUrl:curHref,
            title:title
        };
    }else{
        var curChapter,curUrl = curHref;
        var aElm = $('.chapter-view .title h1 a').get(0);
        title = aElm.innerText;
        var indexUrl = aElm.href;
        curChapter = $('.chapter-view .title h2').text();
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
function updateGf(){
    getFavs(SITE_GF,TYPE_COMIC,updateColRecord(getCurComicGf));
}
/**
 * 切换收藏按钮点击处理函数
 */
function toggleFavHandlerGf(){
    var getChapterInfo = function(text){
        var $html = $(text);
        var imgUrl = $html.find('.book-cover .cover .pic').get(0).src;
        var $as = $html.find('.comic-chapters .chapter-body li a');
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

    getFavs(SITE_GF,TYPE_COMIC,toggleFav(storObj,getCurComicGf,getChapterInfo));
}