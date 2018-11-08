import Constant from '../../../Constant';
import LocalStore from '../../../utils/LocalStore';

const {CUR_FAV,CUR_NAV,STOR_KEY_IS_CLOSE_TIPS} = Constant;
const state = {
    curFavType:CUR_FAV.ALL, //当前显示收藏的类型
    isBatch:false, //是否显示批量处理面板
    isSearch:false, //是否显示搜索输入框
    searchText:'', //搜索的文本
    isCloseTipes:false, //是否关闭提示
    curPanel:CUR_NAV.FAV, //当前显示面板
};


const mutations = {
    save(state,newState) {
        Object.assign(state,newState);
    },
    setSearchText(state,text){
        state.searchText = text;
    },
    async setIsCloseTips(state,b){
        state.isCloseTipes = b;
        await LocalStore.save(STOR_KEY_IS_CLOSE_TIPS,b);
    }
};

const actions = {
    async loadStatus({commit}){
        let isCloseTips = await LocalStore.load(STOR_KEY_IS_CLOSE_TIPS);
      commit('save',{isCloseTips});
    },
    async setIsCloseTips({commit},b){
        commit('setIsCloseTips',b);
    },
    saveStatus({commit, state}, newState) {
        commit('save',newState);
    },
    toggleSearch({commit,state}){
        commit('save',{isSearch:!state.isSearch});
    },
    toggleBatch({commit,state}){
        commit('save',{isBatch:!state.isBatch});
    }
};

//getters
const getters = {

};

export default {
    state,
    mutations,
    actions,
    getters
};
