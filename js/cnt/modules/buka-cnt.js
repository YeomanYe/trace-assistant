import $ from 'jquery';
import {getTypeBySite} from '../../data-struct';
import Constant from '../../Constant';

const {TYPE_COMIC,SITE_BUKA} = Constant;
export default function () {
    let type = getTypeBySite(SITE_BUKA);
    switch (type){
        case TYPE_COMIC:
            window.getCurIndex = getCurIndexBuka;
            window.getChapterInfo = getChapterInfo;
            window.exportCols = null;
            break;
    }
    return type;
}

/**
 * 获取章节信息
 */
function getCurIndexBuka() {
    let retObj;
    let title;
    let indexUrl = curHref;
    if (curHref.search(/buka.cn\/view/) < 0) {
        title = $('.title-font').text().trim()
        //获取漫画名
        retObj = {
            indexUrl: indexUrl,
            title:title
        };
    } else {
        let curUrl = curHref;
        let titleElm = $('.manga-name').get(0);
        title = titleElm.innerText.trim();
        indexUrl = titleElm.href;
        let curChapter = $('#gotoEpisode option:selected').text().trim();

        retObj = {
            indexUrl: indexUrl,
            curUrl: curUrl,
            curChapter: curChapter,
            title:title
        };
    }
    return retObj;
}

function getChapterInfo(text) {
    let $html = $(text);
    let imgUrl = $html.find('.manga-img img').attr('src');
    let $as = $html.find('#episodes .epsbox-eplink');

    let newA = $as.get($as.length - 1) , curA = $as.get(0);

    let tmpArr1,tmpArr2;
    tmpArr1 = newA.href.split('/');
    tmpArr2 = curA.href.split('/');

    if(parseInt(tmpArr1[tmpArr1.length - 1]) < parseInt(tmpArr2[tmpArr1.length - 1])){
        let tmp = newA;
        newA = curA;
        curA = tmp;
    }

    let newChapter, newUrl, curChapter, curUrl;
    newChapter = newA.title.split(':')[1];
    newUrl = newA.href;
    curChapter = curA.title.split(':')[1];
    curUrl = curA.href;
    let retObj = {
        curUrl: curUrl,
        curChapter: curChapter,
        newUrl: newUrl,
        newChapter: newChapter,
        imgUrl: imgUrl
    };
    return retObj;
}
