var vSearchPanel = Vue.component('search-panel', {
    props: {
    },
    data: function () {
        return {
        }
    },
    template: `
          <header id='search'>
            <div class="hd">
                <img src="../../images/search.png" alt=""/>
            </div>
            <div class="bd">
                <input type="text">
            </div>
            <div class="fd">
                <a @click="cancelSearch" class="pointer">取消</a>
            </div> 
        </header>
     `,
    methods: {
        cancelSearch:function () {
            vContentWrap.search = false;
        }
    }
})
