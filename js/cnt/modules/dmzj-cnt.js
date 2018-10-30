import {getTypeBySite} from '../../data-struct';
import Constant from '../../Constant';
import $ from 'jquery-ajax';

const {TYPE_COMIC,SITE_W3_DMZJ,SITE_MH_DMZJ} = Constant;
export default function () {
    let type = getTypeBySite(SITE_W3_DMZJ);
    switch (type){
        case TYPE_COMIC:
            window.getCurIndex = getCurComicW3dmzj;
            window.getChapterInfo = getChapterInfoW3;
            window.exportCols = null;
            break;
    }
    if(type) return type;
    type = getTypeBySite(SITE_MH_DMZJ);
    switch (type){
        case TYPE_COMIC:
            window.getCurIndex = getCurComicMhdmzj;
            window.getChapterInfo = getCurChapterInfoMh;
            window.exportCols = null;
            break;
    }
    if(type) return type;
    if (curHref.indexOf('i.dmzj') >= 0 && curHref.indexOf('login') < 0){
        window.exportCols = exportUserColDmzj;
        type = 'export';
    }
    return type;
}

/**
 * 获取当前页面漫画名称、目录地址、章节名称、章节链接
 */
function getCurComicW3dmzj() {
    let href = location.origin + location.pathname;
    let title = $('.comic_deCon h1 a').text();
    let retObj;
    if (title) {
        retObj = {
            title: title,
            indexUrl: href
        };
    } else {
        let curUrl = href;
        let curChapter = $('.head_title h2').text();
        if (curChapter) {
            let indexA = $('.head_wz a').get(1);
            title = indexA.innerText;
            retObj = {
                title: title,
                indexUrl: indexA.href,
                curUrl: curUrl,
                curChapter: curChapter
            };
        }
    }
    return retObj;
}
/**
 * 获取当前页面漫画名称、目录地址、章节名称、章节链接
 */
function getCurComicMhdmzj() {
    let href = location.origin + location.pathname;
    let title = $('.anim_title_text h1').text();
    let retObj;
    if (title) {
        retObj = {
            title: title,
            indexUrl: href
        };
    } else {
        let curUrl = href;
        let curChapter = $('.display_middle span.redhotl').text();
        if (curChapter) {
            let indexA = $('.display_middle a.redhotl').get(0);
            title = indexA.innerText;
            retObj = {
                title: title,
                indexUrl: indexA.href,
                curUrl: curUrl,
                curChapter: curChapter
            };
        }
    }
    return retObj;
}

function getChapterInfoW3(text) {
    let $html = $(text);
    let imgUrl = $html.find('.comic_i_img img').get(0).src;
    let $as = $html.find('.tab-content-selected .list_con_li a');
    let newA = $as.get(0),
        curA = $as.get($as.length - 1);
    let newChapter, newUrl;
    newChapter = newA.innerText;
    newUrl = newA.href;
    let retObj = {
        newChapter: newChapter,
        newUrl: newUrl,
        curChapter: curA.innerText,
        curUrl: curA.href,
        imgUrl: imgUrl
    };
    return retObj;
}


function getCurChapterInfoMh(text) {
    let $html = $(text);
    let imgUrl = $html.find('.anim_intro_ptext img').get(0).src;
    let $as = $html.find('.cartoon_online_border a');
    let newA = $as.get($as.length - 1),
        curA = $as.get(0);
    let newChapter, newUrl;
    newChapter = newA.innerText;
    newUrl = newA.href;
    let retObj = {
        curChapter: curA.innerText,
        curUrl: curA.href,
        newChapter: newChapter,
        newUrl: newUrl,
        imgUrl: imgUrl
    };
    return retObj;
}
/**
 * 导出动漫之家的收藏
 */
function exportUserColDmzj() {
    return new Promise((resolve,reject)=>{
        $.ajax('https://i.dmzj.com/ajax/my/subscribe', {
            success: function(text) {
                let msgArr = [TYPE_COMIC,text];
                // sendMsg(null, msgArr,handleResData);
                resolve(msgArr);
            },
            type:'POST',
            data:'page=1&type_id=1&letter_id=0&read_id=1'
        });
    });
}
