import $ from 'jquery-ajax';
import {getTypeBySite} from '../../data-struct';
import Constant from '../../Constant';

const {TYPE_VIDEO,SITE_BILIBILI,BG_CMD_EXPORT} = Constant;

export default function () {
    let type = getTypeBySite(SITE_BILIBILI);
    switch (type){
        case TYPE_VIDEO:
            window.getCurIndex = getCurIndexBilibili;
            window.getChapterInfo = getChapterInfo;
            window.exportCols = null;
            break;
    }
    if(curHref.indexOf('space.bilibili') >= 0){
        window.exportCols = exportUserColBilibili;
        type = 'export';
    }
    return type;
}

/**
 * 获取目录连接和标题
 * @returns {*}
 */
function getCurIndexBilibili() {
    let retObj;
    let title;
    if(curHref.indexOf('bangumi/media')>=0){
        retObj = {
            indexUrl:curHref,
            title:$('#app .media-info-title-t').text()
        }
    }else{
        let curUrl = curHref,curChapter;
        let tmpArr = $('#app .header-info h1').text().split('：');
        curChapter = tmpArr[1];
        title = tmpArr[0];
        let indexElm = $('#bangumi_detail .info-title a').get(0);
        if(indexElm)
        retObj = {
            title:title,
            curUrl:curUrl,
            curChapter:curChapter,
            indexUrl:indexElm.href
        }
    }
    return retObj;
}

async function exportUserColBilibili(){
    let userId = location.pathname.match(/\d+/)[0];
    let len = 1,page = 1,sendData,result;
    let baseUrl = 'https://space.bilibili.com/ajax/Bangumi/getList?mid='+userId+'&page=';
    return new Promise((resolve,reject) => {
        let successCallback = function(resData){
            len = resData.data.pages;
            ++page;
            if(!sendData) {
                result = resData.data.result;
                sendData = resData;
            }else{
                result = result.concat(resData.data.result);
                sendData.data.result = result;
            }
            if(page>len){
                let msgArr = [BG_CMD_EXPORT,location.origin,TYPE_VIDEO,sendData];
                resolve(msgArr);
            }else{
                $.ajax(baseUrl+page,{success:successCallback,error:reject});
            }
        };
        $.ajax(baseUrl+page,{success:successCallback,error:reject});
    });
}

function getChapterInfo(text){
    let imgUrl = $('#bangumi_detail .info-cover img').attr('src');
    if(!imgUrl){
        imgUrl = $('#app .media-preview img').attr('src');
    }
    let jsonStr = text.match(/window.__INITIAL_STATE__=({[\S\s]+});/)[1];
    let jsonData = JSON.parse(jsonStr);
    let curUrl,curChapter,newUrl,newChapter,base = 'https://www.bilibili.com/bangumi/play/ep';
    let episodes = jsonData.mediaInfo.episodes;
    let tmp;
    tmp = episodes[0];
    curUrl =  base + tmp.ep_id;
    curChapter = tmp.index  +' '+ tmp.index_title;
    tmp = episodes[episodes.length - 1];
    newUrl = base + tmp.ep_id;
    newChapter = tmp.index + ' ' + tmp.index_title;
    let retObj = {
        curUrl:curUrl,
        curChapter:curChapter,
        newUrl:newUrl,
        newChapter:newChapter,
        imgUrl:imgUrl
    };
    return retObj;
}
