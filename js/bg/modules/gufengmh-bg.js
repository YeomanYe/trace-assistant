import Constant from '../../Constant';
import $ from 'jquery';

const {SITE_GF,TYPE_COMIC} = Constant;

let site = SITE_GF,
    type = TYPE_COMIC;

function query(text) {
    let $html = $(text);
    let $as = $html.find('.comic-chapters .chapter-body li a');
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

export const queryObjArr = [{site,type,resolve:query}];
