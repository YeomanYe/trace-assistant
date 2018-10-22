<template>
    <div v-cloak>
        <search-panel/>
        <toolbar />
        <batch-panel :hide="!batch"></batch-panel>
        <div v-show="curPanel === 0" id="contentFavWrap" class="listWrap">
            <!--切换收藏类型的按钮-->
            <toggle-fav-panel :cur-show-fav="curShowFav"/>
            <!-- 收藏的漫画列表 -->
            <fav-list :batch="batch" :items="items"/>
            <empty-result v-show="items.length === 0"/>
        </div>
        <div v-show="curPanel === 1" id="contentSettingWrap" class="listWrap">
            <!-- 设置列表 -->
            <setting-panel/>
        </div>
        <!-- tab栏 -->
        <nav-panel :cur-show="curPanel"/>
    </div>
</template>

<script>
    import BatchPanel from './component/BatchPanel';
    import EmptyResult from './component/EmptyResult';
    import FavList from './component/FavList';
    import Toolbar from './component/Toolbar';
    import SearchPanel from './component/SearchPanel';
    import ToggleFavPanel from './component/ToggleFavPanel';
    import SettingPanel from './component/SettingPanel';
    import NavPanel from './component/NavPanel';
    import Constant from './constant';
    import {mapState} from 'vuex';
    // import '../css/popup.scss';

    /*var vContentWrap = new Vue();
    // showFavs(0);*/

    const {CUR_FAV,CUR_NAV} = Constant;
    export default {
        components: {BatchPanel,EmptyResult,Toolbar,FavList,SearchPanel,ToggleFavPanel,SettingPanel,NavPanel},
        data:()=>({
            curShow:CUR_FAV.ALL,//当前显示的tab内容
            batch:false, //是否显示批量处理
            search:false,//是否显示搜索面板
            searchText:'',
            curShowFav:CUR_NAV.FAV //当前显示的收藏
        }),
        computed:{
            ...mapState({
                curPanel: state => state.ui.curPanel,
                items: state => state.favs
            })
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "../css/popup";

</style>
