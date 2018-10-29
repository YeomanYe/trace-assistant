import $ from 'jquery';
import {getTypeBySite} from '../../data-struct';
import Constant from '../../Constant';

const {TYPE_COMIC,SITE_CARTOONMAD} = Constant;
export default function () {
    let type = getTypeBySite(SITE_CARTOONMAD);
    switch (type){
        case TYPE_COMIC:
            window.getCurIndex = getCurComicCartoonMad;
            window.getChapterInfo = getChapterInfo;
            window.wayFlag = {originCode:'big5'};
            window.exportCols = null;
            break;
    }
    return type;
}


/**
 * 获取章节信息
 */
function getCurComicCartoonMad(){
    let tmpArr = document.title.split(' - ');
    let title = tmpArr[0];
    title.substr(title.length - 2,2);
    let retObj;
    if(title.substr(title.length - 2,2) !== '漫畫'){
        retObj = {
            indexUrl:curHref,
            title:title
        };
    }else{
        title = title.substr(0,title.length - 2);
        let indexUrl = $('table table center li a:eq(0)').attr('href');
        let curUrl = curHref;
        let curChapter = tmpArr[1];
        retObj = {
            indexUrl:indexUrl,
            title:title,
            curUrl:curUrl,
            curChapter:curChapter
        }
    }
    return retObj;
}


function getChapterInfo(text){
    let $html = $(text);
    let imgUrl = $html.find('.cover + img').get(0).src;
    let $as = $html.find('fieldset#info legend + table a');
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
