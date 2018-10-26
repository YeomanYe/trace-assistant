import {getItemByEqObj} from '../utils/ArrayUtil';
import Constant from '../Constant';

import bilibili from './modules/bilibili';
import buka from './modules/buka';
import cartoonmad from './modules/cartoonmad';
import gf from './modules/gf';
import kuaikan from './modules/kuaikan';
import kuku from './modules/kuku';
import mhdmzj from './modules/mhdmzj';
import qidian from './modules/qidian';
import qq from './modules/qq';
import w3dmzj from './modules/w3dmzj';


const {TYPE_COMIC} = Constant;

const allStructs = [].concat(
    bilibili,buka,cartoonmad,
    gf,kuaikan,kuku,mhdmzj,
    qidian,qq,w3dmzj
);
export function getBaseStoreObj(site,type = TYPE_COMIC){
    let baseStruct = getItemByEqObj(allStructs,{site,type});
    return baseStruct;
}

export function getTypeByCurHref() {
    let href = window.location.href;
    for(let structObj of allStructs){
        if(href.search(structObj.regExp) >= 0){
            return structObj.type;
        }
    }
}

export function getBaseStructByHref(href) {
    let searchArr = allStructs.map(item => item.regExp);
    for (let regExp of searchArr) {
        if (href.search(regExp) >= 0) {

            let baseStruct = getItemByEqObj(allStructs, {regExp});
            delete baseStruct.regExp;
            return baseStruct;
        }
    }
    return {};
}

export function getBaseStructByCurHref(){
    let href = window.location.href;
    return getBaseStructByHref(href);
}
