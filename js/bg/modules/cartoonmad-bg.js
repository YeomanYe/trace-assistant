import Constant from '../../Constant';
import $ from 'jquery';

const {SITE_CARTOONMAD,TYPE_COMIC} = Constant;
let site = SITE_CARTOONMAD,
    type = TYPE_COMIC;
function query(data) {
    let $html = $(data);
    let $as = $html.find('fieldset#info legend + table a');
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

export const queryObjArr = [{site,type,resolve:query,wayFlag:{originCode:'gbk'}}];
