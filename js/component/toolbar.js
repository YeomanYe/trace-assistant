var vToolbar = Vue.component('toolbar', {
    props: {
        batch:Boolean
    },
    data: function () {
        return {
            bdArr: [
                {
                    title: '给个好评',
                    icon:'fa-thumbs-o-up',
                    wrapStyle:'margin-top:1px;',
                    href: 'https://chrome.google.com/webstore/detail/%E8%BF%BD%E7%BB%BC%E9%A5%AD/fajeglfbhflmbaccedmbgelodcbljobl/reviews?utm_source=chrome-ntp-icon'
                },
                {title: '批量操作',icon:'fa-list',wrapStyle:'margin-top:3px;'},
                {title:'搜索',icon:'fa-search'}
            ]
        }
    },
    template: `
          <header id='toolbar'>
            <div class="hd">
                <img src="../../images/icon/logo-white32.png" alt=""/>
                <h1>追综饭</h1>
            </div>
            <template v-for="(bdObj,index) in bdArr" >
                <a target="_blank" @click="clickHandler(index,bdObj)" :style="bdObj.wrapStyle" :title="bdObj.title" :href="bdObj.href">
                    <i class="fa" :class="bdObj.icon"/>
                </a>
            </template>
        </header>
     `,
    methods: {
        clickHandler:function(index){
            switch(index){
                case 0:break;
                case 1:vContentWrap.batch = !vContentWrap.batch;break;
                case 2:vContentWrap.search = true;break;
            }
        }
    }
})
