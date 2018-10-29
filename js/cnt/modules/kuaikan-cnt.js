import $ from 'jquery-ajax';
import {getTypeBySite} from '../../data-struct';
import Constant from '../../Constant';

const {TYPE_COMIC,SITE_KUAIKAN,BG_CMD_EXPORT} = Constant;
export default function () {
    let type = getTypeBySite(SITE_KUAIKAN);
    switch (type){
        case TYPE_COMIC:
            window.getCurIndex = getCurComicKk;
            window.getChapterInfo = getChapterInfo;
            window.exportCols = exportCols;
            break;
    }
    return type;
}

function exportCols() {
    let msgArr = [BG_CMD_EXPORT,location.origin,TYPE_COMIC];
    return msgArr
}

/**
 * 漫画页或目录页获取漫画名称及目录地址
 * 如果是漫画页，获取当前章节和URL
 */
function getCurComicKk() {
    let title = $('body .article-detail-info .comic-name').text();
    let href = location.origin + location.pathname;
    let retObj;
    if (href.indexOf('topic') >= 0) {
        retObj = {
            title: title,
            indexUrl: href,
        };
    } else {
        let aElm = $('#main h2 .ico a').get(1);
        let curUrl = href;
        let curChapter = $('#main h2 .ico').html().replace(/.*\<\/span>/, '').trim();
        if (aElm)
            retObj = {
                title: aElm.title,
                indexUrl: aElm.href,
                curUrl: curUrl,
                curChapter: curChapter
            };
    }
    return retObj
}

function getChapterInfo(text) {
    let $html = $(text);
    let $as = $html.find('table .tit a');
    let title = $html.find('.comic-name').text();
    let newA = $as.get(0);
    let curA = $as.get($as.length - 1);
    let retObj = {
        newUrl: newA.href,
        curUrl: curA.href,
        newChapter: newA.title,
        curChapter: curA.title,
    };
    let imgQuerySuccess = function(data) {
        retObj.imgUrl = data.data.hit[0].vertical_image_url;
    };
    $.ajax('http://www.kuaikanmanhua.com/v1/search/topic', {
        async: false,
        success: imgQuerySuccess,
        type: 'GET',
        data: {
            q: title,
            since:0,
            size:5,
            f:3
        },
    });
    return retObj;
}
