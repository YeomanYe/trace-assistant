<template>
    <header id='search'>
        <div class="hd">
            <i class="fa fa-search"/>
        </div>
        <div class="bd">
            <input autofocus v-model.trim="searchText" @input="inputSearch" type="text">
        </div>
        <div class="fd">
            <a @click="cancelSearch" class="pointer">取消</a>
        </div>
    </header>
</template>

<script>
    // var vSearchPanel = Vue.component('search-panel', )
    import vContentWrap from '../App';

    export default {
        props: {
        },
        data: function () {
            return {
                searchText:''
            }
        },
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
    }
</script>
