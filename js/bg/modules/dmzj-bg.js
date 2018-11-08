import Constant from '../../Constant';
import $ from 'jquery';

const {SITE_MH_DMZJ,SITE_W3_DMZJ,TYPE_COMIC:type} = Constant;

function mhQuery(data) {
    let $html = $(data);
    let $as = $html.find('.cartoon_online_border li a');
    let newA = $as.get($as.length - 1);
    let newChapter, newUrl;
    newChapter = newA.innerText;
    newUrl = newA.href;
    let resObj = {
        newUrl: newUrl,
        newChapter: newChapter
    };
    return resObj;
}

function w3Query(text) {
    let $html = $(text);
    let $as = $html.find('.tab-content-selected .list_con_li a');
    let newA = $as.get(0);
    let newChapter, newUrl;
    newChapter = newA.innerText;
    newUrl = newA.href;
    let resObj = {
        newUrl: newUrl,
        newChapter: newChapter
    };
    return resObj;
}

export const queryObjArr = [
    {site:SITE_MH_DMZJ,type,resolve:mhQuery},
    {site:SITE_W3_DMZJ,type,resolve:w3Query}
];

/**
 * 动漫之家导出用户收藏的漫画
 */
/*
_exportFunObj[SITE_DMZJ+'-'+TYPE_COMIC] = function(args,resSend) {
    let htmlText = args[3];
    let w3dmzjStorObj = getBaseStoreObj(SITE_W3_DMZJ);
    let mhdmzjStorObj = getBaseStoreObj(SITE_MH_DMZJ);

    let w3dmzjIndexCall = function(indexUrl, storObj, favs, allFavs) {
        return function(text) {
            let $html = $(text);
            let $as = $html.find('.tab-content-selected .list_con_li a');
            let title = $html.find('.comic_deCon h1 a').text();
            let index = arrEqStr(favs, {title:title});
            if (index > 0) return;
            let imgUrl = $html.find('.comic_i_img img').get(0).src;
            let baseChapter = storObj.baseChapter,
                baseImg = storObj.baseImg,
                baseIndex = 'http://www.dmzj.com/info/';
            let newA = $as.get(0),
                curA = $as.get($as.length - 1);
            let newChapter, newUrl, curUrl, curChapter;
            imgUrl = imgUrl.replace(baseImg, '');
            newChapter = newA.innerText;
            newUrl = newA.href;
            newUrl = replaceOrigin(newUrl, storObj.origin).replace(baseChapter, '');
            curChapter = curA.innerText;
            curUrl = curA.href;
            curUrl = replaceOrigin(curUrl, storObj.origin).replace(baseChapter, '');
            let colItem = {
                newUrl: newUrl,
                newChapter: newChapter,
                curChapter: curChapter,
                curUrl: curUrl,
                title: title,
                imgUrl: imgUrl,
                isUpdate: false,
                indexUrl: indexUrl.replace(baseIndex, '')
            };
            favs.unshift(colItem);
            storeDebounce({[STOR_KEY_FAVS]:allFavs});
        }
    };
    let mhdmzjIndexCall = function(indexUrl, storObj, favs, allFavs) {
        return function(text) {
            let $html = $(text);
            let $as = $html.find('.cartoon_online_border li a');
            let title = $html.find('.odd_anim_title_m h1').text();
            let index = arrEqStr(favs, {title:title});
            if (index > 0) return;
            let imgUrl = $html.find('.anim_intro_ptext img').get(0).src;
            let baseChapter = storObj.baseChapter,
                baseImg = storObj.baseImg,
                baseIndex = 'http://manhua.dmzj.com';
            let newA = $as.get($as.length - 1),
                curA = $as.get(0);
            let newChapter, newUrl, curUrl, curChapter;
            imgUrl = imgUrl.replace(baseImg, '');
            newChapter = newA.innerText;
            newUrl = newA.href;
            newUrl = replaceOrigin(newUrl, storObj.origin).replace(baseChapter, '');
            curChapter = curA.innerText;
            curUrl = curA.href;
            curUrl = replaceOrigin(curUrl, storObj.origin).replace(baseChapter, '');
            let colItem = {
                newUrl: newUrl,
                newChapter: newChapter,
                curChapter: curChapter,
                curUrl: curUrl,
                title: title,
                imgUrl: imgUrl,
                isUpdate: false,
                indexUrl: indexUrl.replace(baseIndex, '')
            };
            favs.unshift(colItem);
            storeDebounce({[STOR_KEY_FAVS]:allFavs});
        }
    };
    getFavs(SITE_W3_DMZJ, TYPE_COMIC, function(w3dmzjFavs, allFavs) {
        storLocal.set({[STOR_KEY_FAVS]:allFavs});
        getFavs(SITE_MH_DMZJ, TYPE_COMIC, function(mhdmzjFavs, allFavs) {
            let index = arrEqStr(allFavs,{site:SITE_W3_DMZJ,type:TYPE_COMIC});
            w3dmzjFavs = allFavs[index].cols;
            let $html = $(htmlText);
            let $as = $html.find('.dy_img a');
            for (let i = 0, len = $as.length; i < len; i++) {
                let indexUrl = $as.get(i).href;
                let callback;
                if (indexUrl.indexOf(SITE_W3_DMZJ) >= 0) {
                    callback = w3dmzjIndexCall(indexUrl, w3dmzjStorObj, w3dmzjFavs, allFavs);
                    $.ajax(indexUrl, {
                        success: callback,
                        async: true
                    });
                } else {
                    callback = mhdmzjIndexCall(indexUrl, mhdmzjStorObj, mhdmzjFavs, allFavs)
                    $.ajax(indexUrl, {
                        success: callback,
                        async: true
                    });
                }
            }
            resSend({status:STATUS_OK});
        });
    });
};
*/
