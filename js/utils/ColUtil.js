import LocalStore from './LocalStore';
import Constant from '../Constant';
import {arrEqObj} from './ArrayUtil';
import $ from 'jquery-ajax';
import buffer from 'buffer';
import iconv from 'iconv-lite';

export function formatHref(href, baseHref) {
    let retHref;
    let index = href.search('^https?://');
    if (index < 0) {
        //如果href不是http打头，那么应该为 //www.xx.com/dd 这样的形式
        if (!baseHref) retHref = 'http:' + href;
        else {
            href = baseHref + href;
            index = href.search('^https?://');
            if (index < 0) retHref = 'http:' + href;
            else retHref = href;
        }
    } else {
        retHref = href;
    }
    return retHref;
}

const {STOR_KEY_FAVS} = Constant;
/**
 * 获取某站点下所有收藏的漫画,以及漫画中更新的数目
 */
export async function getFavs(baseInfo) {
    let {site,type} = baseInfo;
    let allFavs = await LocalStore.load(STOR_KEY_FAVS);
    allFavs = allFavs ? allFavs : [];
    let index = -1;
    if (allFavs.length) index = arrEqObj(allFavs, {site, type});
    let cols = [];
    if (index < 0) {
        baseInfo.cols = cols;
        allFavs.unshift(baseInfo);
    } else {
        cols = allFavs[index].cols;
    }
    return {cols,allFavs};
}

/**
 * 获取index内容通过iframe的形式
 * @param indexUrl
 * @param wayFlag
 * @param sucCall
 */
export async function getChapterContentByIndex(indexUrl, wayFlag, sucCall) {
    return new Promise((resolve,reject)=>{
        if (typeof wayFlag !== 'object') {
            $.ajax(indexUrl, {
                async: true,
                success: resolve,
                error:reject
            });
        } else {
            htmlDecode(indexUrl, wayFlag.originCode,resolve,reject);
        }
    });
}

/**
 * 替换html编码通过iframe的形式。
 * 有的页面比较复杂，使用iframe的方式等它完全呈现出来时比较好获取信息
 * @param url
 * @param sucCall
 */
function htmlDecodeByFrame(url, sucCall) {
    var $iframe = $('#indexInfoFrame'), frElm;
    if ($iframe.length === 0) {
        $iframe = $('<iframe id="indexInfoFrame" style="display:none;" hidden></iframe>');
    }
    $iframe.attr('src', url);
    frElm = $iframe.get(0);
    frElm.onload = function (e) {
        var textHtml = frElm.contentWindow.document.body.innerHTML;
        log('iframe', textHtml);
        sucCall(textHtml);
    };
    $('body').append($iframe);
}

/**
 * 转换html编码
 * @param url
 * @param originCode
 * @returns {string}
 */
function htmlDecode(url, originCode, resolve,reject) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (oEvent) {
        let arrayBuffer = xhr.response; // Note: not oReq.responseText
        let text;
        try {
            text = iconv.decode(buffer.Buffer.from(arrayBuffer), originCode);
            resolve(text);
        } catch (e) {
            console.warn(e);
            reject(e);
        }
    };
    xhr.send(null);
}
