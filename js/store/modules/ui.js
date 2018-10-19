import Constant from '../../constant';

const {CUR_FAV,CUR_NAV} = Constant;
const state = {
    curFavType:CUR_FAV.ALL, //当前显示收藏的类型
    isBatch:false, //是否显示批量处理面板
    isSearch:false, //是否显示搜索输入框
    searchText:'', //搜索的文本
    curPanel:CUR_NAV.FAV, //当前显示面板
};


const mutations = {
    save(state,newState) {
        Object.assign(state,newState);
    },
    setSearchText(state,text){
        state.searchText = text;
    },
};

const actions = {
    saveStatus({commit, state}, newState) {
        commit('save',newState);
    },
    toggleSearch({commit,state}){
        commit('save',{isSearch:!state.isSearch});
    },
    toggleBatch({commit,state}){
        commit('save',{isBatch:!state.isBatch});
    },
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
