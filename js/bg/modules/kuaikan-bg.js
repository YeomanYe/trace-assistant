import Constant from '../../Constant';
import $ from 'jquery';

const {SITE_KUAIKAN:site,TYPE_COMIC:type} = Constant;

function query(data) {
    let $html = $(data);
    let aElm = $html.find('table .tit a').get(0);
    let newChapter = aElm.title;
    let tmpArr = aElm.href.split('/');
    let newUrl = tmpArr[tmpArr.length - 2];
    let resObj = {
        newUrl: newUrl,
        newChapter: newChapter
    };
    return resObj;
}
export const queryObjArr = [{site,type,resolve:query}];

/**
 * 快看漫画导出用户的收藏
_exportFunObj[SITE_KUAIKAN+'-'+TYPE_COMIC] = function(args,resSend) {
    let origin = args[1];
    let kuaikanStorObj = getBaseStoreObj(SITE_KUAIKAN),
        baseImgUrl = kuaikanStorObj.baseImg,
        baseIndexUrl = kuaikanStorObj.baseIndex;
    let pageNum = 1,
        baseUrl = origin + '/web/fav/topics',
        size = 16;
    getFavs(SITE_KUAIKAN, TYPE_COMIC, function(cols, allFavs) {
        //递归遍历，获取所有的收藏结果
        let successCallback = function(resData) {
            log('resData', resData);
            let status = resData.status_code;
            if(status === 401){
                resSend({status:STATUS_UNAUTH});//未登录
                return;
            }
            let datas = resData.data.topics;
            let storDatas = [];

            datas.forEach(function(data) {
                let indexCompleteUrl = baseIndexUrl + '/' + data.id;
                let resText = $.ajax(indexCompleteUrl, {
                    async: false
                }).responseText;
                // log('resText',resText);
                let $html = $(resText);
                let $as = $html.find('.tit a');
                log('$as', $as);
                let newA = $as.get(0),
                    curA = $as.get($as.length - 1);
                //如果数组中有标题和目录链接则说明已经存在该漫画了
                let title = data.title,
                    indexUrl = '/' + data.id;
                if (arrEqStr(cols, {title:title}) >= 0) return;
                let tmpArr, newUrl, curUrl;
                tmpArr = newA.href.split('/');
                newUrl = tmpArr[tmpArr.length - 2] + '/';
                tmpArr = curA.href.split('/');
                curUrl = tmpArr[tmpArr.length - 2] + '/';
                storDatas.push({
                    imgUrl: data.vertical_image_url.replace(baseImgUrl, ''),
                    indexUrl: indexUrl,
                    newUrl: newUrl, //最新章节地址
                    curUrl: curUrl, //当前章节地址
                    newChapter: data.latest_comic_title, //最新章节名称
                    curChapter: curA.innerText.replace(/\s/g, ''), //当前章节名称
                    title: title,
                    isUpdate: false
                });
            });
            addArr(cols,storDatas);
            log('storDatas', storDatas);
            if (datas.length === size) {
                ++pageNum;
                let url = baseUrl + '?page=' + pageNum + '&size=' + size;
                log('url', url);
                $.ajax(url, {
                    success: successCallback
                });
            } else {
                kuaikanStorObj.cols = cols;
                log('storObj', kuaikanStorObj);
                log('allFavs', allFavs);
                storLocal.set({
                    [STOR_KEY_FAVS]: allFavs
                });
                resSend({status:STATUS_OK});//导出成功
            }
        };
        $.ajax(baseUrl + '?page=' + pageNum + '&size=' + size, {
            success: successCallback
        });
    });
};*/
