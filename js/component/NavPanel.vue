<template>
    <nav id="nav">
        <span v-for="(text,index) in textArr" @click="setPanel(index)"  :class="{curTab:curShow == index}">{{text}}</span>
    </nav>
</template>

<script>
    /*let CUR_NAV = {
        FAV:0,
        SETTING:1
    };
    let switchTipsElm;
    let vNavPanel = Vue.component('nav-panel', );*/
    import vContentWrap from '../App';
    import Constant from '../constant';
    import LocalStore from '../utils/LocalStore';
    import {mapActions} from 'vuex';

    let switchTipsElm;
    const {STOR_KEY_IS_CLOSE_TIPS} = Constant;
    export default {
        props: {
            curShow: Number
        },
        data:function () {
            return {
                textArr:['收藏','设置']
            };
        },
        methods: {
            ...mapActions({
                setPanel:(dispatch,curPanel) => {
                    dispatch('saveStatus',{curPanel});
                }
            }),
            showContentToggle:async function (contentId) {
                vContentWrap.curShow = contentId;
                if(contentId === 1){
                    if(switchTipsElm)return;
                    let status = await LocalStore.load(STOR_KEY_IS_CLOSE_TIPS);
                    status = !status;
                    switchTipsElm = new Switch(document.getElementById('switchTips'), {size: 'middle',onChange:function (e) {
                            let checked = switchTipsElm.getChecked();
                            LocalStore.save(STOR_KEY_IS_CLOSE_TIPS,!checked);
                    }});
                    if(status) switchTipsElm.on();
                    /*getStoreLocal(STOR_KEY_IS_CLOSE_TIPS,function (status) {
                        status = !status;
                        switchTipsElm = new Switch(document.getElementById('switchTips'), {size: 'middle',onChange:function (e) {
                                let checked = switchTipsElm.getChecked();
                                storLocal.set({[STOR_KEY_IS_CLOSE_TIPS]:!checked});
                            }});
                        if(status) switchTipsElm.on();
                    });*/
                }
            },
        },
    }
</script>
