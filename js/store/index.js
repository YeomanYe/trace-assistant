import Vue from 'vue';
import Vuex from 'vuex';

import favs from './modules/favs';
import ui from './modules/ui';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        favs,ui
    }
});
