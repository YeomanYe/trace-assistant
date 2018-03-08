$(function(){
    if(location.href.indexOf('www.dmzj') >= 0){
        log('www.dmzj');
        // _$imgExport.on('click',exportUserColQq);
        _$imgToggle.on('click',toggleFavHandlerW3dmzj);
        updateW3dmzj();
    }else if(location.href.indexOf('manhua.dmzj') >= 0){
        _$imgToggle.on('click',toggleFavHandlerMhdmzj);
        updateMhdmzj();
    }
    
});
/**
 * 更新收藏
 */
function updateMhdmzj(){
    getFavs('manhua.dmzj',storObj,updateColRecord(getCurComicMhdmzj));
}
/**
 * 更新收藏
 */
function updateW3dmzj(){
    getFavs('www.dmzj',storObj,updateColRecord(getCurComicW3dmzj));
}
if (location.href.indexOf('www.dmzj') >= 0) {
    var origin = location.origin,
        baseImgUrl = 'https://images.dmzj.com/img/webpic/',
        baseChapterUrl = origin + '/view/',
        baseIndexUrl = origin + '/info/';

    var storObj = {
        baseImg: baseImgUrl,
        baseIndex: baseIndexUrl,
        baseChapter: baseChapterUrl,
        origin: origin,
        site: 'www.dmzj'
    };
}

if (location.href.indexOf('manhua.dmzj') >= 0) {
    origin = location.origin;
    baseImgUrl = 'https://images.dmzj.com/webpic/';
    baseChapterUrl = origin;
    baseIndexUrl = origin;

    storObj = {
        baseImg: baseImgUrl,
        baseIndex: baseIndexUrl,
        baseChapter: baseChapterUrl,
        origin: origin,
        site: 'manhua.dmzj'
    };
}
/**
 * 获取当前页面漫画名称、目录地址、章节名称、章节链接
 */
function getCurComicW3dmzj(){
    var href = location.origin + location.pathname;
    var title = $('.comic_deCon h1 a').text();
    var retObj;
    if(title){
        retObj = {
            title:title,
            indexUrl:href
        };
    }else{
        var curUrl = href;
        var curChapter = $('.head_title h2').text();
        if(curChapter){
            var indexA = $('.head_wz a').get(1);
            title = indexA.innerText;
            retObj = {
                title:title,
                indexUrl:indexA.href,
                curUrl:curUrl,
                curChapter:curChapter
            };
        }
    }
    return retObj;
}
/**
 * 获取当前页面漫画名称、目录地址、章节名称、章节链接
 */
function getCurComicMhdmzj(){
    var href = location.origin + location.pathname;
    var title = $('.anim_title_text h1').text();
    var retObj;
    if(title){
        retObj = {
            title:title,
            indexUrl:href
        };
    }else{
        var curUrl = href;
        var curChapter = $('.display_middle span.redhotl').text();
        if(curChapter){
            var indexA = $('.display_middle a.redhotl').get(0);
            title = indexA.innerText;
            retObj = {
                title:title,
                indexUrl:indexA.href,
                curUrl:curUrl,
                curChapter:curChapter
            };
        }
    }
    return retObj;
}
/**
 * 切换收藏按钮点击处理函数
 */
function toggleFavHandlerW3dmzj(){
    var obj = getCurComicW3dmzj();
    getFavs('www.dmzj',storObj,toggleFavW3dmzj(obj.title,obj.indexUrl,obj.curChapter,obj.curUrl));
}
/**
 * 切换收藏
 */
function toggleFavW3dmzj(title,indexUrl,curChapter,curUrl){
    return function(dmzjFavs,allFavs){
        var index = arrInStr(dmzjFavs,title,'title');
        //已经收藏，则取消收藏
        if(index >= 0){
            dmzjFavs.splice(index,1);
            storLocal.set({allFavs:allFavs});
            return;
        }
        //未收藏，则收藏
        var sucCall = function(text){
            var $html = $(text);
            var imgUrl = $html.find('.comic_i_img img').get(0).src;
            var $as = $html.find('.tab-content-selected .list_con_li a');
            var newA = $as.get(0),curA = $as.get($as.length - 1);
            var newChapter,newUrl;
            newChapter = newA.innerText;
            newUrl = newA.href;
            curChapter = curChapter ? curChapter : curA.innerText;
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
            dmzjFavs.unshift(col);
            storLocal.set({allFavs:allFavs});
        };
        $.ajax(indexUrl,{success:sucCall});
    }
}

/**
 * 切换收藏按钮点击处理函数
 */
function toggleFavHandlerMhdmzj(){
    var obj = getCurComicMhdmzj();
    getFavs('manhua.dmzj',storObj,toggleFavMhdmzj(obj.title,obj.indexUrl,obj.curChapter,obj.curUrl));
}
/**
 * 切换收藏
 */
function toggleFavMhdmzj(title,indexUrl,curChapter,curUrl){
    return function(dmzjFavs,allFavs){
        var index = arrInStr(dmzjFavs,title,'title');
        //已经收藏，则取消收藏
        if(index >= 0){
            dmzjFavs.splice(index,1);
            storLocal.set({allFavs:allFavs});
            return;
        }
        //未收藏，则收藏
        var sucCall = function(text){
            var $html = $(text);
            var imgUrl = $html.find('.anim_intro_ptext img').get(0).src;
            var $as = $html.find('.cartoon_online_border a');
            var newA = $as.get($as.length - 1),curA = $as.get(0);
            var newChapter,newUrl;
            newChapter = newA.title;
            newUrl = newA.href;
            curChapter = curChapter ? curChapter : curA.title;
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
            dmzjFavs.unshift(col);
            storLocal.set({allFavs:allFavs});
        };
        $.ajax(indexUrl,{success:sucCall});
    }
}