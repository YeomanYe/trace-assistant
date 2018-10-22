import LocalStore from '../../utils/LocalStore';
import Constant from '../../constant';
import {formatHref} from '../../utils/ExtUtil';

const state = [];

const {STOR_KEY_FAVS,CUR_FAV,TYPE_VIDEO,TYPE_FICTION,TYPE_COMIC} = Constant;

const mutations = {
    query(state,arr) {
        state.splice(0,state.length,...arr);
        console.log('state',state);
    },
};

const actions = {
    async queryFav({commit, state}) {
        let arr = await LocalStore.load(STOR_KEY_FAVS);
        //当没有保存任何数据时，返回的是空对象
        if(!arr || (arr && !arr.length)){
            arr = [];
        }
        commit('query', arr);
    },
};

//getters
const getters = {
    displayFavs(state,getters,rootState){
        let type = undefined;
        let allFavs = state;
        let {ui:{searchText,curFavType}} = rootState;
        switch (curFavType) {
            case CUR_FAV.COMIC:
                type = TYPE_COMIC;
                break;
            case CUR_FAV.FICTION:
                type = TYPE_FICTION;
                break;
            case CUR_FAV.VIDEO:
                type = TYPE_VIDEO;
                break;
        }
        let cols = [];
        allFavs = allFavs ? allFavs : [];
        for (let i = 0, len = allFavs.length; i < len; i++) {
            let favItem = allFavs[i],
                colItems = favItem.cols ? favItem.cols : [],
                baseChapter = favItem.baseChapter,
                baseIndex = favItem.baseIndex,
                baseImg = favItem.baseImg;
            let tmpArr = [];

            if (type && type !== favItem.type) continue;
            for (let j = 0, len2 = colItems.length; j < len2; j++) {
                let item = colItems[j],obj = Object.assign({},item);
                obj.indexUrl = formatHref(item.indexUrl, baseIndex);
                obj.imgUrl = formatHref(item.imgUrl, baseImg);
                obj.curUrl = formatHref(item.curUrl, baseChapter);
                obj.newUrl = formatHref(item.newUrl, baseChapter);
                obj.type = favItem.type;
                obj.siteName = favItem.siteName;
                obj.origin = favItem.origin;
                if(searchText && item.title.indexOf(searchText) < 0) continue;
                tmpArr.push(obj);
            }
            cols = cols.concat(tmpArr);
        }
        return sortFavItems(cols);
    }
};

/**
 * 排序显示收藏项
 * @returns {*[]}
 */
function sortFavItems(cols) {
    //按照阅读的时间进行降序排序
    cols.sort(function (obj1, obj2) {
        let val1 = obj1.timestamp ? obj1.timestamp : 0;
        let val2 = obj2.timestamp ? obj2.timestamp : 0;
        return val2 - val1;
    });
    //有更新的排在前头
    let tmpArr1 = [],tmpArr2 = [];
    for(let i=0,len=cols.length;i<len;i++){
        let c = cols[i];
        if(c.isUpdate) {
            tmpArr1.push(c);
        }else{
            tmpArr2.push(c);
        }
    }
    return Object.assign([],tmpArr1.concat(tmpArr2));
}


export default {
    state,
    mutations,
    actions,
    getters
};
