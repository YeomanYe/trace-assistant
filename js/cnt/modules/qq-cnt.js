
import $ from 'jquery-ajax';
import {getTypeBySite} from '../../data-struct';
import Constant from '../../Constant';

const {TYPE_COMIC,SITE_QQ,BG_CMD_EXPORT} = Constant;
export default function () {
    let type = getTypeBySite(SITE_QQ);
    switch (type){
        case TYPE_COMIC:
            window.getCurIndex = getCurComicQq;
            window.getChapterInfo = getChapterInfo;
            window.exportCols = exportUserColQq;
            break;
    }
    return type;
}


/**
 * 导出腾讯动漫用户配置
 */
async function exportUserColQq(){
    return new Promise((resolve,reject) => {
        $.ajax('http://ac.qq.com/MyPersonalCenter/getUserCollection', {
            success: function (text) {
                let msgArr = [BG_CMD_EXPORT, location.origin, TYPE_COMIC, text];
                resolve(msgArr);
                // sendMsg(null, msgArr, handleResData);
            },
            error:reject
        });
    });
}
/**
 * 获取章节信息
 */
function getCurComicQq(){
    let $as = $('.chapter-page-all a');
    let retObj,title;
    if($as.length){
        title = $('.works-intro-title').text();
        retObj = {
            indexUrl:curHref,
            title
        };
    }else{
        let curUrl = curHref;
        let aElm = $('#chapter')[0];
        if(aElm){
            let indexUrl = aElm.href;
            let curChapter = $('#comicTitle .title-comicHeading').text();
            title = aElm.title;
            retObj = {
                indexUrl:indexUrl,
                title:title,
                curUrl:curUrl,
                curChapter:curChapter
            }
        }
    }
    return retObj;
}

function getChapterInfo(text){
    let $html = $(text);
    let imgUrl = $html.find('.works-cover img').get(0).src;
    let $as = $html.find('.chapter-page-all a');
    let newA = $as.get($as.length - 1),curA = $as.get(0);
    let tmpArr = newA.title.split('：');
    let newChapter,newUrl,curChapter,curUrl;
    newChapter = tmpArr[1];
    newUrl = newA.href;
    tmpArr = curA.title.split('：');
    curChapter = tmpArr[1];
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
