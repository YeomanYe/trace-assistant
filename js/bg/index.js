import Constant from '../Constant';
import {cGetUrl, sendToAllTabs} from '../utils/ExtUtil';
import {formatHref, getChapterContentByIndex, getFavs, getUpdateNum, replaceOrigin} from '../utils/ColUtil';
import LocalStore from '../utils/LocalStore';
import {getBaseStoreObj} from '../data-struct';
import {exportObjArr, queryObjArr} from './modules';
import {arrEqObj} from '../utils/ArrayUtil';

const {BG_CMD_EXPORT,BG_CMD_UPDATE_NUM,BG_CMD_UPDATE_FAV_BTN,CNT_CMD_UPDATE_CUR_FAV,STOR_KEY_FAVS,STOR_KEY_IS_CLOSE_TIPS,STATUS_OK,STATUS_EXPORT_FAIL} = Constant;
/**
 * 查询是否有更新
 */
async function allQuery() {
    setBadge('....','blue'); //提示正在查询中
    //执行查询
    for(let queryObj of queryObjArr){
        let {site,type,wayFlag,resolve} = queryObj;
        await queryUpdate(site,type,resolve,wayFlag);
    }
    //显示提示
    let isCloseTips = await LocalStore.load(STOR_KEY_IS_CLOSE_TIPS);
    let notify = () => {
        if(updateColArr.length === 0) return;
        let {col,baseChapter,baseImg} = updateColArr.shift();
        let {title, imgUrl, newChapter, newUrl} = col;
        createNotify(title, formatHref(imgUrl, baseImg), '更新到: ' + newChapter, baseChapter + newUrl);
        setTimeout(notify,1000);
    };
    //生成提示
    if (!isCloseTips){
        notify();
    }
    await updateBadge();
    setTimeout(allQuery, 1000 * 60 * 45);
}

allQuery();

// updateBadge(allQuery);

//监听消息
chrome.runtime.onMessage.addListener(function(msgArr,msgSenderObj,resSend) {
    switch (msgArr[0]) {
        case BG_CMD_UPDATE_NUM:
            updateBadge();
            break;
        case BG_CMD_EXPORT:
            exportCollect(msgArr,resSend);
            break;
        case BG_CMD_UPDATE_FAV_BTN:
            sendToAllTabs([CNT_CMD_UPDATE_CUR_FAV]);
            break;
    }
    return true;
});

//点击提醒打开链接
chrome.notifications.onClicked.addListener(function(url) {
    window.open(url);
});

chrome.notifications.onButtonClicked.addListener(function(url,btnIndex){
    let updateToNews = async function(){
        let allFavs = await LocalStore.load(STOR_KEY_FAVS);
        for(let len = allFavs.length;--len;){
            let favItem = allFavs[len];
            let cols = favItem.cols;
            for(let len2=cols.length;len2--;){
                let colItem = cols[len2];
                let url2 = formatHref(colItem.newUrl,favItem.baseChapter);
                if(url === url2) {
                    colItem.curChapter = colItem.newChapter;
                    colItem.curUrl = colItem.newUrl;
                    colItem.isUpdate = false;
                    await LocalStore.save(STOR_KEY_FAVS,allFavs);
                    return;
                }
            }
        }
    };
    switch(btnIndex){
        case 0:window.open(url);break;
        case 1:updateToNews();break;
    }
    chrome.notifications.clear(url);
});

/**
 * 更新下标更新的数目
 */
async function updateBadge() {
    let updateNum = await getUpdateNum();
    setBadge(updateNum);
}


/**
 * 设置徽章
 */
function setBadge(num,color) {
    color = color ? color : 'red';
    if (num <= 0) {
        chrome.browserAction.setBadgeText({
            text: ''
        });
        chrome.browserAction.setBadgeBackgroundColor({
            color: color
        });
        return;
    }
    chrome.browserAction.setBadgeText({
        text: '' + num
    });
    chrome.browserAction.setBadgeBackgroundColor({
        color: color
    })
}

/**
 * 根据决定条件决定是否执行导出函数，如果执行则将导出的漫画存储在本地中
 * extra需要从datas中带入到handlefun中的数据的字段的名称
 */
/*async function pipeExport(site,type,datas, handleFun, resSend) {
    let baseInfo = getBaseStoreObj(site,type);
    let {baseImg,baseIndex,baseChapter,origin} = baseInfo;
    let resObj = {status: STATUS_OK, msg: []};

    let indexSucCall = function (cols, colItem, args) {
        return function (text) {
            let obj = handleFun(text, resSend, args);
            if (obj.status !== STATUS_OK) {
                resObj.status = STATUS_EXPORT_FAIL;
                resObj.msg.push(obj.msg);
                return;
            }
            //处理数据格式
            let {newUrl,curUrl,imgUrl} = obj;
            newUrl = replaceOrigin(newUrl, baseChapter).replace(baseChapter, '');
            curUrl = replaceOrigin(curUrl, baseChapter).replace(baseChapter, '');
            imgUrl = replaceOrigin(imgUrl, baseImg).replace(baseImg, '');

            colItem.newUrl = newUrl;
            colItem.curUrl = curUrl;
            colItem.imgUrl = imgUrl;
            colItem.isUpdate = false;

            let index = arrEqObj(cols, {title: obj.title});
            if (index < 0) {
                cols.unshift(colItem);
            }
        }
    };
    let {cols,allFavs} = await getFavs(baseInfo);
    for (let i = 0, len = datas.length; i < len; i++) {
        let item = datas[i];
        let index = arrEqObj(cols, {title: item.title});
        //当收藏中没有该漫画时才添加
        if (index < 0) {
            let colItem = assignColItem(item);
            $.ajax(formatHref(item.indexUrl, baseIndex), {
                success: indexSucCall(cols, colItem, item),
                async: false
            });
        }
    }
    await LocalStore.save(STOR_KEY_FAVS,allFavs);
    resSend(resObj);
}*/

/**
 * 创建提醒
 */
function createNotify(title, iconUrl, message, newUrl) {
    let options = {
        type: chrome.notifications.TemplateType.BASIC,
        title: title,
        iconUrl: iconUrl,
        isClickable: true,
        buttons: [
            {title: '打开', iconUrl: cGetUrl('images/notification-buttons/ic_flash_auto_black_48dp.png')},
            {title: '已读', iconUrl: cGetUrl('images/notification-buttons/ic_exposure_plus_1_black_48dp.png')}],
        message: message
    };
    chrome.notifications.create(newUrl, options);
}
/**
 * 查询是否有更新的通用函数
 */
let updateColArr = []; //保存有更新的col数组，统一处理
async function queryUpdate(site,type,callback, wayFlag) {
    let baseInfo = getBaseStoreObj(site,type);
    let {baseIndex,baseImg,baseChapter} = baseInfo;
    let {cols,allFavs} = await getFavs(baseInfo);
    for(let col of cols){
        try {
            let data = await getChapterContentByIndex(formatHref(col.indexUrl, baseIndex),wayFlag);
            let resObj = await callback(data);
            let {newUrl,newChapter} = resObj;
            if (col.newChapter !== newChapter) {
                console.log('newChapter',newChapter);
                col.newChapter = newChapter;
                col.newUrl = replaceOrigin(newUrl, baseChapter).replace(baseChapter, '');
                updateColArr.push({col,baseChapter,baseImg});

                if (!col.isUpdate) {
                    col.isUpdate = true;
                }
            }
        } catch (e) {
            console.log('bg query',e);
        }
    }
    await LocalStore.save({allFavs});
}


/**
 * 导出收藏到插件中。
 */
async function exportCollect(args,resSend) {
    for(let exportFun of exportObjArr){
        await exportFun(args,resSend);
    }
}
