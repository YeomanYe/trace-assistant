var vToolbar = Vue.component('toolbar', {
    props: {
        batch:Boolean
    },
    data: function () {
        return {
            bdArr: [
                {
                    title: '给个好评',
                    img: '../../images/praise.png',
                    href: 'https://chrome.google.com/webstore/detail/%E8%BF%BD%E7%BB%BC%E9%A5%AD/fajeglfbhflmbaccedmbgelodcbljobl/reviews?utm_source=chrome-ntp-icon'
                },
                {title: '批量操作', img: '../../images/batch.png',click:'vToolbar.batch = !vToolbar.batch'},
                {title:'搜索',img:'../../images/search.png'}
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
                <div class="bd" >
                    <a target="_blank" @click="clickHandler(index,bdObj)" :title="bdObj.title" :href="bdObj.href">
                        <img :src="bdObj.img" alt=""/>
                    </a>
                </div>
            </template>
        </header>
     `,
    methods: {
        clickHandler:function(index){
            switch(index){
                case 0:break;
                case 1:vContentWrap.batch = !vContentWrap.batch;break;
            }
        }
    }
})
