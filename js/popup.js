var switchTipsElm;
showFavs(0);

var vContentWrap = new Vue({
    el:'#contentWrap',
    data:{
        curShow:CUR_FAV.ALL,//当前显示的tab内容
        items: [],//收藏的集合
        curShowFav:CUR_NAV.FAV //当前显示的收藏
    },
    methods:{

    }
});

