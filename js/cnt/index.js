import $ from './ext-jquery';
import {showTips} from '../utils/ViewUtil';
import Constant from '../Constant';
import {cGetUrl, sendBg, sendToAllTabs} from '../utils/ExtUtil';
import {arrEqObj} from '../utils/ArrayUtil';
import LocalStore from '../utils/LocalStore';
import {getChapterContentByIndex, getFavs} from '../utils/ColUtil';
import {getBaseInfoByCurHref} from '../data-struct';
import * as inspectFunObj from './modules';

//设置全局变量
window.$ = window.jQuery = $;
window.curHref = location.origin + location.pathname;

const {CNT_CMD_UPDATE_CUR_FAV,BG_CMD_UPDATE_FAV_BTN,STOR_KEY_FAVS,STATUS_OK,STATUS_UNAUTH,STATUS_EXPORT_FAIL,TIME_LONG} = Constant;

let _$imgAss,_$imgExport,_$imgToggle;

let _src = {
    collect:cGetUrl('images/collect.png'),
    collectGrey:cGetUrl('images/collect-grey.png'),
    exportCollect:cGetUrl('images/export-collect.png'),
    comicGrey:cGetUrl('images/comic-grey.png'),
    comic:cGetUrl('images/comic.png')
};

//获取基本信息
chrome.runtime.onMessage.addListener(function(msgArr,msgSenderObj,resSend) {
    switch (msgArr[0]) {
        case CNT_CMD_UPDATE_CUR_FAV:
            updateColRecord();
            break;
    }
    return true;
});
//初始化函数
$(function(){
    let isMatch;
    for(let key in inspectFunObj){
        if(inspectFunObj.hasOwnProperty(key)){
            isMatch = inspectFunObj[key]();
            if(isMatch) break;
        }
    }
    if(isMatch){
        createBtn();
        setTimeout(updateColRecord,1500)
    }
});
//创建按钮
function createBtn(){
    let $ul = $('<ul>');
    $ul.addClass('img-list');
    $ul.attr({draggable:true});
    _$imgExport = addImgToUL($ul,_src.exportCollect,null,'导出网站中收藏的漫画到插件中');
    _$imgToggle = addImgToUL($ul,_src.collectGrey,null,'收藏');
    _$imgAss = addImgToUL($ul,_src.comic,toggleMenu,'切换菜单');
    _$imgExport.on('click',async function () {
        let {exportCols} = window;
        if(exportCols){
            let datas = await exportCols();
            datas = await sendBg(datas);
            handleBgResData(datas);
        }
        else showTips('该网站暂不支持导出');
    });
    _$imgToggle.on('click',function () {
       toggleFav();
    });
    // let left = $(window).width() - 120,top = $(window).height() - 220;
    $ul.drag();
    // $ul.css({top:top+'px',left:left+'px'});
    $('body').append($ul);
}
//给ul列表中加入一个图片
function addImgToUL($ul,srcStr,clickHandler,title){
    let $li = $('<li>'),$img = $('<img>');
    $img.addClass('fab-img');
    $img.get(0).src = srcStr;
    $img.get(0).title = title;
    if(clickHandler) $img.on('click',clickHandler);
    $li.append($img);
    $ul.append($li);
    return $img;
}
/**
 * 切换菜单图标
 */
function toggleMenu(){
    let imgElm = _$imgAss.get(0);
    if(imgElm.src === _src.comicGrey){
        imgElm.src = _src.comic;
        /*_$imgExport.css('visibility','visible');
        _$imgToggle.css('visibility','visible');*/
    }else{
        imgElm.src = _src.comicGrey;
        /*_$imgExport.css('visibility','hidden');
        _$imgToggle.css('visibility','hidden');*/
    }
    _$imgExport.toggle();
    _$imgToggle.toggle();
}
/**
 * 收藏或取消收藏
 * wayFlag 获取方式
 */
async function toggleFav() {
    let {getCurIndex,getChapterInfo,wayFlag} = window;
    if(!getCurIndex) return; //不匹配页面直接返回
    let baseInfo = getBaseInfoByCurHref();
    let {cols,allFavs} = await getFavs(baseInfo);
    let indexInfo = await getCurIndex();
    let {title,indexUrl} = indexInfo;
    let index = arrEqObj(cols, {title});
    //已经收藏，则取消收藏
    if (index >= 0) {
        cols.splice(index, 1);
        await LocalStore.save(STOR_KEY_FAVS,allFavs);
        _$imgToggle.attr('src',_src.collectGrey);
        showTips('取消收藏成功');
        //通知全部tab页面更新图标
        await sendBg([BG_CMD_UPDATE_FAV_BTN]);
        return;
    }
    //未收藏，则收藏
    let text = await getChapterContentByIndex(indexUrl,wayFlag);
    //获取章节与图片信息
    let chapterInfo = getChapterInfo(text);
    let col = createCol(indexInfo,chapterInfo,baseInfo);
    cols.unshift(col);
    await LocalStore.save(STOR_KEY_FAVS,allFavs);
    //通知全部tab页面更新图标
    _$imgToggle.attr('src',_src.collect);
    showTips('收藏成功');
    await sendBg([BG_CMD_UPDATE_FAV_BTN]);
}

/**
 * 更新阅读记录
 * async 是否异步获取的信息
 */
async function updateColRecord() {
    let {getCurIndex} = window;
    //不匹配页面时，直接返回
    if(!getCurIndex) return;
    let baseInfo = getBaseInfoByCurHref();
    let {cols,allFavs} = await getFavs(baseInfo);
    let indexInfo = await getCurIndex();
    //解析当前页面并更新阅读记录
    let index = arrEqObj(cols, {title: indexInfo.title});
    _$imgToggle.get(0).src = _src.collectGrey;
    if (index < 0) return;
    //更新图标
    _$imgToggle.get(0).src = _src.collect;
    let curItem = cols[index];
    curItem.timestamp = Date.now();
    if (!indexInfo.curChapter) return;
    let {baseChapter} = baseInfo;
    curItem.curChapter = indexInfo.curChapter;
    curItem.curUrl = indexInfo.curUrl.replace(baseChapter, '');
    //更新，当前更新的漫画数量
    await LocalStore.save(STOR_KEY_FAVS,allFavs);
    //更新未读数
    await sendBg([BG_CMD_UPDATE_FAV_BTN]);
}

/**
 * 根据信息创建收藏
 * @param indexInfo
 * @param chapterInfo
 * @param baseInfo
 * @returns {{imgUrl: *, indexUrl: *, newChapter: *, curChapter: *, newUrl: *, curUrl: *, title: *, isUpdate: boolean}}
 */
function createCol(indexInfo,chapterInfo,baseInfo) {
    let {title,indexUrl,curUrl,curChapter} = indexInfo;
    let {imgUrl,newUrl,newChapter,curUrl:newCurUrl,curChapter:newCurChapter} = chapterInfo;
    let {baseChapter,baseImg,baseIndex} = baseInfo;
    curUrl = curUrl || newCurUrl;
    curChapter = curChapter || newCurChapter;
    return {
        imgUrl: imgUrl.replace(baseImg, ''),
        indexUrl: indexUrl.replace(baseIndex, ''),
        newChapter: newChapter,
        curChapter: curChapter,
        timestamp: Date.now(),
        newUrl: newUrl.replace(baseChapter, ''), //最新章节地址
        curUrl: curUrl.replace(baseChapter, ''), //当前章节地址
        title: title,
        isUpdate: false
    };
}

/**
 * 处理响应数据
 */
function handleBgResData(data) {
    console.log('handleBgResData', data);
    let status = data.status;
    if (status === STATUS_OK) {
        //更新当前页面收藏的图标
        updateColRecord();
        showTips('操作成功');
        return;
    } else if (status === STATUS_UNAUTH) {
        showTips('请先登录');
    } else if (status === STATUS_EXPORT_FAIL) {
        let str = '';
        for (let i = 0, len = data.msg.length; i < len; i++) {
            str += ' 《' + data.msg[i] + '》 ';
        }
        showTips('导出失败,请手动添加：' + str, TIME_LONG);
        //更新当前页面收藏的图标
        updateColRecord();
    }
}
