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
 * 获取更新的数量
 * @returns {Promise<void>}
 */
export async function getUpdateNum() {
    let allFavs = await LocalStore.load(STOR_KEY_FAVS,true);
    if(!allFavs) return 0;
    let updateNum = 0;
    allFavs.map(fav => {
        let cols = fav.cols;
        cols.map(col => {
            if(col.isUpdate) updateNum++;
        });
    });
    return updateNum;
}

/**
 * 获取index内容通过iframe的形式
 * @param indexUrl
 * @param wayFlag
 */
export async function getChapterContentByIndex(indexUrl, wayFlag) {
    return new Promise(async (resolve,reject)=>{
        if (typeof wayFlag !== 'object') {
            $.ajax(indexUrl, {
                async: true,
                success: resolve,
                error:reject
            });
        } else {
            try {
                let data = await htmlDecode(indexUrl, wayFlag.originCode);
                resolve(data);
            }catch (e) {
                reject(e);
            }
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
    let $iframe = $('#indexInfoFrame'), frElm;
    if ($iframe.length === 0) {
        $iframe = $('<iframe id="indexInfoFrame" style="display:none;" hidden></iframe>');
    }
    $iframe.attr('src', url);
    frElm = $iframe.get(0);
    frElm.onload = function (e) {
        let textHtml = frElm.contentWindow.document.body.innerHTML;
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
export function htmlDecode(url, originCode) {
    return new Promise((resolve,reject)=>{
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
    });
}
/**
 * 替换origin
 */
export function replaceOrigin(url1, url2) {
    let originReg = /[\S]+?:\/\/[^/]+/;
    let matches1 = url1.match(originReg),
        matches2 = url2.match(originReg);
    if(matches1){
        let origin1 = matches1[0],
            origin2 = matches2[0];
        url1 = url1.replace(origin1,origin2);
    }
    return url1;
}
