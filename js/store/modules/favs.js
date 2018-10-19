import LocalStore from '../../utils/LocalStore';
import Constant from '../../constant';

const state = [];

const {STOR_KEY_FAVS} = Constant;

const mutations = {
    query(state,arr) {
        state.splice(0,state.length,...arr);
    },
};

const actions = {
    async queryFav({commit, state}, {type,text}) {
        let arr = await LocalStore.load(STOR_KEY_FAVS);
        //当没有保存任何数据时，返回的是空对象
        if(arr || !arr.length){
            arr = [];
        }
        commit('query', arr);
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
