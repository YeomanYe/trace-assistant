/**
 * 动漫之家导出用户收藏
 */
function dmzjExport(){

}
/**
 * 查询收藏的动漫之家漫画是否有更新
 */
function mhdmzjQuery() {
    var baseObj = {
        baseIndex: 'https://manhua.dmzj.com',
        baseImage: 'https://images.dmzj.com/webpic/',
        baseChapter: 'https://manhua.dmzj.com'
    };
    var ajaxCall = function(data) {
        var $html = $(data);
        var origin = 'https://manhua.dmzj.com';
        var baseChapter = origin;
        var $as = $html.find('.cartoon_online_border li a');
        var newA = $as.get($as.length - 1);
        var newChapter,newUrl;
        newChapter = newA.innerText;
        newUrl = newA.href;
        newUrl = replaceOrigin(newUrl,origin).replace(baseChapter,'');
        var resObj = {
            newUrl: newUrl,
            newChapter: newChapter
        };
        return resObj;
    };
    return queryUpdate(baseObj, ajaxCall);
}
/**
 * 查询收藏的动漫之家漫画是否有更新
 */
function w3dmzjQuery() {
    var baseObj = {
        baseIndex: 'https://www.dmzj.com/info/',
        baseImage: 'https://images.dmzj.com/img/webpic/',
        baseChapter: 'https://www.dmzj.com/view/'
    };
    var ajaxCall = function(text) {
        var $html = $(text);
        var $as = $html.find('.tab-content-selected .list_con_li a');
        var baseChapter='https://www.dmzj.com/view/';
        var newA = $as.get(0);
        var newChapter,newUrl;
        newChapter = newA.innerText;
        newUrl = newA.href;
        newUrl = replaceOrigin(newUrl,'https://www.dmzj.com').replace(baseChapter,'');
        var resObj = {
            newUrl: newUrl,
            newChapter: newChapter
        };
        return resObj;
    };
    return queryUpdate(baseObj, ajaxCall);
}