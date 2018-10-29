import $ from 'jquery-ajax';
import {getTypeBySite} from '../../data-struct';
import Constant from '../../Constant';

const {TYPE_FICTION,SITE_QIDIAN,BG_CMD_EXPORT} = Constant;
export default function () {
    let type = getTypeBySite(SITE_QIDIAN);
    switch (type){
        case TYPE_FICTION:
            window.getCurIndex = getCuIndexQidian;
            window.getChapterInfo = getChapterInfo;
            window.exportCols = null;
            break;
    }
    if(curHref.indexOf('https://my.qidian.com/bookcase')>=0){
        window.exportCols = exportQidian;
        type = 'export';
    }
    return type;
}

/**
 * 导出起点收藏的小说
 */
function exportQidian() {
    let $as = $('#shelfTable .shelf-table-name b a').not('.fen-category');
    let arr = [];
    for(let i=0,len=$as.length;i<len;i++){
        let aElm = $as.get(i);
        arr.push({
            title:aElm.innerText,
            indexUrl:aElm.href.replace(baseIndexUrl,'')
        });
    }
    let extra = {
        datas:arr,
        site:SITE_QIDIAN,
        type:TYPE_FICTION
    };
    let msgArr = [BG_CMD_EXPORT,location.origin,TYPE_FICTION,extra];
    return msgArr;
}

function getCuIndexQidian(){
    let title = $('.book-info h1 em').text();
    let retObj;
    if (curHref.indexOf('book.qidian') >= 0) {
        retObj = {
            title: title,
            indexUrl: curHref,
        };
    } else {
        let aElm = $('.crumbs-nav .act').get(0);
        let curUrl = curHref;
        let curChapter = $('#j_chapterBox .j_chapterName').text();
        if (aElm)
            retObj = {
                title: aElm.innerText,
                indexUrl: aElm.href,
                curUrl: curUrl,
                curChapter: curChapter
            };
    }
    return retObj
}

function getChapterInfo(text){
    let $html = $(text);
    let imgUrl = $html.find('#bookImg img').attr('src');
    let $as = $html.find('#j-catalogWrap .cf a');
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
