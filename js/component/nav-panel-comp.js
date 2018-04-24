/*@flow*/
var CUR_NAV:string = {
    FAV:0,
    SETTING:1
};
var switchTipsElm:Object;
var vNavPanel = Vue.component('nav-panel', {
    props: {
        curShow: Number
    },
    data:function () {
        return {
            textArr:['收藏','设置']
        };
    },
    template: `
    <nav id="nav">
        <span v-for="(text,index) in textArr" @click="showContentToggle(index)"  :class="{curTab:curShow == index}">{{text}}</span>
    </nav>
     `,
    methods: {
        showContentToggle:function (contentId:number) {
            vContentWrap.curShow = contentId;
            if(contentId == 1){
                if(switchTipsElm)return;
                getStoreLocal(STOR_KEY_IS_CLOSE_TIPS,function (status:boolean) {
                    status = !status;
                    switchTipsElm = new Switch(document.getElementById('switchTips'), {size: 'middle',onChange:function (e) {
                        var checked = switchTipsElm.getChecked();
                        storLocal.set({[STOR_KEY_IS_CLOSE_TIPS]:!checked});
                    }});
                    if(status) switchTipsElm.on();
                });
            }
        },
    }
});