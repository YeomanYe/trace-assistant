import Constant from '../../Constant';
import $ from 'jquery';

const {TYPE_FICTION:type,SITE_QIDIAN:site} = Constant;

function query(data) {
    let $html = $(data);
    let $as = $html.find('#j-catalogWrap .cf a');
    let newA = $as.get($as.length - 1);
    let newChapter,newUrl;
    newChapter = newA.innerText;
    newUrl = newA.href;
    let resObj = {
        newUrl: newUrl,
        newChapter: newChapter
    };
    return resObj;
}

export const queryObjArr = [
    {site,type,resolve:query}
];

/*==========================*/



/**
 * 起点导出用户的收藏
 */
/*
_exportFunObj[SITE_QIDIAN+'-'+TYPE_FICTION] = function(args, resSend) {
    let dataArg = args[3];
    console.log('dataArg',dataArg);
    let handleData = function(text, resSend,data) {
        let retObj;
        try {
            let $html = $(text);
            let imgUrl = $html.find('#bookImg img').attr('src');
            let $as = $html.find('#j-catalogWrap .cf a');
            let newA = $as.get($as.length - 1),curA = $as.get(0);
            let newChapter,newUrl,curChapter,curUrl;
            newChapter = newA.innerText;
            newUrl = newA.href.replace('chrome-extension','https');
            curChapter = curA.innerText;
            curUrl = curA.href.replace('chrome-extension','https');
            retObj = {
                status:STATUS_OK,
                curUrl:curUrl,
                curChapter:curChapter,
                newUrl:newUrl,
                newChapter:newChapter,
                imgUrl:imgUrl,
                title:data.title
            };
            return retObj;
        }catch(e){
            retObj = {status:STATUS_EXPORT_FAIL,msg:data.title};
        }
        return retObj;
    };
    pipeExport(dataArg, handleData, resSend);
};
*/
