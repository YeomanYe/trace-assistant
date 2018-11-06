import {getBaseStoreObj} from '../../data-struct';
import {replaceOrigin} from '../../utils/ColUtil';
import Constant from '../../Constant';
import $ from 'jquery';

const {SITE_BUKA,TYPE_COMIC} = Constant;

function query(text) {
    let $html = $(text);
    let baseObj = getBaseStoreObj(SITE_BUKA,TYPE_COMIC);
    let baseChapter = baseObj.baseChapter;
    let $as = $html.find('#episodes .epsbox-eplink');
    let newA = $as.get($as.length - 1) , curA = $as.get(0);
    let tmpArr1,tmpArr2;
    tmpArr1 = newA.href.split('/');
    tmpArr2 = curA.href.split('/');

    if(parseInt(tmpArr1[tmpArr1.length - 1]) < parseInt(tmpArr2[tmpArr1.length - 1])){
        newA = curA;
    }

    let newChapter = newA.title.split(':')[1],
        newUrl = newA.href;

    let resObj = {
        newUrl: replaceOrigin(newUrl, baseObj.origin).replace(baseChapter, ''),
        newChapter
    };
    return resObj;
}

export const queryObjArr = [{site:SITE_BUKA,type:TYPE_COMIC,resolve:query}];
