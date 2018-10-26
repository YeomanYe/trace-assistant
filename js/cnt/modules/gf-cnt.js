import $ from 'jquery';
import {getTypeByCurHref} from '../../data-struct';
import Constant from '../../Constant';

const {TYPE_COMIC} = Constant;
export default function () {
    let type = getTypeByCurHref();
    switch (type){
        case TYPE_COMIC:
            window.getCurIndex = getCurComicGf;
            window.getChapterInfo = getChapterInfo;
            window.exportCols = null;
            break;
    }
    return type;
}
/**
 * 获取章节信息
 */
function getCurComicGf(){
    let retObj;
    let title = $('.book-title h1').text();
    if(title){
        retObj = {
            indexUrl:curHref,
            title:title
        };
    }else{
        let curChapter,curUrl = curHref;
        let aElm = $('.chapter-view .title h1 a').get(0);
        title = aElm.innerText;
        let indexUrl = aElm.href;
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
function getChapterInfo(text){
    let $html = $(text);
    let imgUrl = $html.find('.book-cover .cover .pic').get(0).src;
    let $as = $html.find('.comic-chapters .chapter-body li a');
    let newA = $as.get($as.length - 1),curA = $as.get(0);
    let newChapter,newUrl,curChapter,curUrl;
    newChapter = newA.innerText;
    newUrl = newA.href;
    curChapter = curA.innerText;
    curUrl = curA.href;
    let retObj = {
        curUrl:curUrl,
        curChapter:curChapter,
        newUrl:newUrl,
        newChapter:newChapter,
        imgUrl:imgUrl
    };
    return retObj;
}
