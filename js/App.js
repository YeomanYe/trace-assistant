showFavs(0);

var vContentWrap = new Vue({
    el:'#contentWrap',
    data:{
        curShow:CUR_FAV.ALL,//当前显示的tab内容
        items: [],//收藏的集合
        batch:false, //是否显示批量处理
        search:false,//是否显示搜索面板
        curShowFav:CUR_NAV.FAV //当前显示的收藏
    },
    template:`
    <div>
        <search-panel v-show="search" ></search-panel>
        <toolbar :batch="batch" ></toolbar>
        <batch-panel :hide="!batch"></batch-panel>
        <div v-show="curShow == 0" id="contentFavWrap" class="listWrap">
            <!--切换收藏类型的按钮-->
            <toggle-fav-panel :cur-show-fav="curShowFav"></toggle-fav-panel>
            <!-- 收藏的漫画列表 -->
            <fav-list :batch="batch" :items="items"></fav-list>
        </div>
        <div v-show="curShow == 1" id="contentSettingWrap" class="listWrap">
            <!-- 设置列表 -->
            <setting-panel></setting-panel>
        </div>
        <!-- tab栏 -->
        <nav-panel :cur-show="curShow"></nav-panel>
    </div>
    `,
    methods:{

    }
});
