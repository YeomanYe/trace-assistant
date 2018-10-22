import Vue from 'vue';
import App from './App.vue';
import store from './store';
import ToggleButton from 'vue-js-toggle-button';

Vue.use(ToggleButton);

new Vue({
    el:'#root',
    store,
    render:h => h(App)
});
