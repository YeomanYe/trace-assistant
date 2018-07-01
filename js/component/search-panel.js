var vSearchPanel = Vue.component('search-panel', {
    props: {
    },
    data: function () {
        return {
            searchText:''
        }
    },
    template: `
          <header id='search'>
            <div class="hd">
                <img src="../../images/search.png" alt=""/>
            </div>
            <div class="bd">
                <input v-model.trim="searchText" @input="inputSearch" type="text">
            </div>
            <div class="fd">
                <a @click="cancelSearch" class="pointer">取消</a>
            </div> 
        </header>
     `,
    methods: {
        cancelSearch:function () {
            vContentWrap.search = false;
            vContentWrap.searchText = '';
            showFavs(vContentWrap.curShowFav);
        },
        inputSearch:function () {
            vContentWrap.searchText = this.searchText;
            showFavs(vContentWrap.curShowFav);
        }
    }
})