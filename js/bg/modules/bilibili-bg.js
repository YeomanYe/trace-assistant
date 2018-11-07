import {getBaseStoreObj} from '../../data-struct';
import Constant from '../../Constant';
import $ from 'jquery';

const {SITE_BILIBILI,TYPE_VIDEO} = Constant;
let site = SITE_BILIBILI,
    type = TYPE_VIDEO;

function query(data) {
    let jsonStr = data.match(/window.__INITIAL_STATE__=({[\S\s]+});/)[1];
    let jsonData = JSON.parse(jsonStr);
    let newUrl,newChapter,base = 'https://www.bilibili.com/bangumi/play/ep';
    let episodes = jsonData.mediaInfo.episodes;
    let tmp;
    tmp = episodes[episodes.length - 1];
    newUrl = base + tmp.ep_id;
    newChapter = '第'+ tmp.index + '话 ' + tmp.index_title;
    let resObj = {
        newUrl: newUrl,
        newChapter: newChapter
    };
    return resObj;
}

export const queryArrObj = [{site,type,resolve:query}];

/**
 * 腾讯动漫导出用户的收藏
 */
/*_exportFunObj[SITE_BILIBILI+'-'+TYPE_VIDEO] = function(args, resSend) {
    let json = args[3];
    let userCols = json.data.result;
    let storObj = getBaseStoreObj(SITE_BILIBILI,TYPE_VIDEO);
    let ajaxSuc = function (item) {
        return function (text) {
            let $html = $(text);
            let epId = $html.find('.main-inner .v1-bangumi-list-season .cur').data('newest-ep-id');
            item.indexUrl = 'https://www.bilibili.com/bangumi/play/ep' + epId;
        }
    }
    for (let i = 0, len = userCols.length; i < len; i++) {
        let item = userCols[i];
        item.imgUrl = item.cover.replace('http:','').replace(storObj.baseImg,'');
        //获取可以获取到目录页信息的URL
        $.ajax(item.share_url,{success:ajaxSuc(item),async:false});
    }
    let dataArg = {
        datas:userCols,
        type:TYPE_VIDEO,
        site:SITE_BILIBILI
    };
    log('dataArg',dataArg);
    let handleData = function(text, resSend,data) {
        let retObj;
        try {
            let $html = $(text);
            let jsonStr = text.match(/window.__INITIAL_STATE__=({[\S\s]+});/)[1];
            let jsonData = JSON.parse(jsonStr);
            log('initJsonData',jsonData);
            let curUrl,curChapter,newUrl,newChapter,base = 'https://www.bilibili.com/bangumi/play/ep';
            let episodes = jsonData.epList;
            let tmp;
            let indexA = $html.find('#bangumi_detail .info-title a').get(0);
            tmp = episodes[0];
            curUrl =  base + tmp.ep_id;
            curChapter = '第'+ tmp.index + '话 ' + tmp.index_title;
            tmp = episodes[episodes.length - 1];
            newUrl = base + tmp.ep_id;
            newChapter = '第'+ tmp.index + '话 ' + tmp.index_title;
            retObj = {
                status:STATUS_OK,
                curUrl:curUrl,
                title:data.title,
                curChapter:curChapter,
                newUrl:newUrl,
                newChapter:newChapter,
                indexUrl:indexA.href.replace('chrome-extension','https')
            };
        }catch(e){
            log(e);
            retObj = {
                status:STATUS_EXPORT_FAIL,
                msg:data.title
            }
        }
        return retObj;
    };
    pipeExport(dataArg, handleData, resSend);
};*/
