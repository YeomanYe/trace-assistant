import $ from 'jquery';
import {getTypeBySite} from '../../data-struct';
import Constant from '../../Constant';
import {htmlDecode} from '../../utils/ColUtil';

const {TYPE_COMIC,SITE_KUKU} = Constant;

export default function () {
    let type = getTypeBySite(SITE_KUKU);
    switch (type){
        case TYPE_COMIC:
            window.getCurIndex = getCurComicKuku;
            window.getChapterInfo = getChapterInfo;
            window.wayFlag = {originCode:'gbk'};
            window.exportCols = null;
            break;
    }
    return type;
}

/**
 * 获取章节信息
 */
async function getCurComicKuku() {
    let retObj;
    let title;
    let indexUrl = curHref;
    if (curHref.search(/comiclist\/[\d]*\/[\d]+/) < 0) {
        //获取漫画名
        retObj = {
            indexUrl: indexUrl
        };
    } else {
        let curUrl = curHref;
        let tmpArr = curHref.split('/');
        indexUrl = tmpArr.splice(0, tmpArr.length - 2).join('/');
        let tdHtmlText = $('table:eq(1) tbody tr:eq(0)').html();
        tmpArr = tdHtmlText.match(/<td [\s\S]*?>([\s\S]*)[\s\S]*<input name/)[1].split('|');
        tmpArr = tmpArr[0].split(' ');
        let curChapter = tmpArr.splice(0, tmpArr.length - 1).join(' ');

        retObj = {
            indexUrl: indexUrl,
            curUrl: curUrl,
            curChapter: curChapter
        };
    }
    //获取标题
    let text = await htmlDecode(indexUrl,'gbk');
    let $html = $(text);
    title = $html.find('table table:eq(3)').find('tr td').eq(0).text();
    title = title.substring(0, title.length - 2);
    retObj.title = title;

    return retObj;
}


function getChapterInfo(text) {
    let $html = $(text);
    let $as = $html.find('table table:eq(3)').find('tr td a');
    let newA = $as.get($as.length - 4), curA = $as.get(0);
    let imgUrl = $html.find('table table:eq(3)').find('tr td img').attr('src');

    let newChapter, newUrl, curChapter, curUrl;
    newChapter = newA.innerText;
    newUrl = newA.href;
    curChapter = curA.innerText;
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
