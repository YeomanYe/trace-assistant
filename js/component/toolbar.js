var vToolbar = Vue.component('toolbar', {
    props: {},
    data: function () {
        return {
            bdArr: [
                {
                    title: '给个好评',
                    img: '../../images/praise.png',
                    href: 'https://chrome.google.com/webstore/detail/%E8%BF%BD%E7%BB%BC%E9%A5%AD/fajeglfbhflmbaccedmbgelodcbljobl/reviews?utm_source=chrome-ntp-icon'
                },
                {title: '批量操作', img: '../../images/batch.png'}
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
                <div class="bd">
                    <a target="_blank" :title="bdObj.title" :href="bdObj.href || 'javascript:;'">
                        <img :src="bdObj.img" alt=""/>
                    </a>
                </div>
            </template>
        </header>
     `,
    methods: {}
})
