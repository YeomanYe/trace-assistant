import Constant from '../../Constant';
import $ from 'jquery';

const {TYPE_COMIC,SITE_QQ:site} = Constant;

function query(data) {
    let $html = $(data);
    let $as = $html.find('#chapter .works-chapter-list-wr .chapter-page-all a');
    let newA = $as.get($as.length - 1);
    let newChapter = newA.innerText.trim();
    let newUrl = newA.href;
    let resObj = {
        newUrl: newUrl,
        newChapter: newChapter
    };
    return resObj;
}
export const queryObjArr = [
    {site,type:TYPE_COMIC,resolve:query}
];
/**
 * 导出用户的收藏
 */
/*
_exportFunObj[SITE_QQ+'-'+TYPE_COMIC] = function(args, resSend) {
    let dataStr = args[3];
    let status = JSON.parse(dataStr).status;
    if (status === '-99') {
        resSend({
            status: STATUS_UNAUTH
        });
        return;
    }
    let userCols = JSON.parse(dataStr).data;
    for (let i = 0, len = userCols.length; i < len; i++) {
        userCols[i].indexUrl = userCols[i].id;
    }
    let dataArg = {
        datas:userCols,
        type:TYPE_COMIC,
        site:SITE_QQ
    };
    log('dataArg',dataArg);
    let handleData = function(text, resSend,data) {
        let curSeqNo = data.nextSeqNo;
        let retObj;
        try {
            let $html = $(text);
            let $as = $html.find('#chapter .works-chapter-list-wr .chapter-page-all a');
            curSeqNo = $as.length - 1 < curSeqNo ? $as.length - 1 : curSeqNo;
            let newA = $as.get($as.length - 1),
                curA = $as.get(curSeqNo);
            let tmpArr = newA.title.split('：');
            let newChapter, curChapter;
            newChapter = tmpArr[1];
            tmpArr = curA.title.split('：');
            curChapter = tmpArr[1];
            let newUrl = newA.href,
                curUrl = curA.href;
            let imgUrl = $html.find('.works-cover img').attr('src');
            retObj = {
                status:STATUS_OK,
                newUrl:newUrl,
                curUrl:curUrl,
                newChapter:newChapter,
                curChapter:curChapter,
                title:data.title,
                imgUrl:imgUrl
            }
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
