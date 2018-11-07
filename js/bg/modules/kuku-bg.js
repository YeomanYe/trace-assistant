import Constant from '../../Constant';
import $ from 'jquery';

const {SITE_KUKU,TYPE_COMIC} = Constant;
function query(data) {
    let $html = $(data);
    let $as = $html.find('table table:eq(3)').find('tr td a');
    let newA = $as.get($as.length - 4);
    let newChapter,newUrl;
    newChapter = newA.innerText;
    newUrl = newA.href;

    let resObj = {
        newUrl: newUrl,
        newChapter: newChapter
    };
    return resObj;
}

export const queryObjArr = [{site:SITE_KUKU,type:TYPE_COMIC,resolve:query}];
