var CUR_FAV = {
    ALL:0,
    COMIC:1,
    FICTION:2,
    VIDEO:3
};
function showFavs(curShowFav) {
    var type = undefined;
    switch (curShowFav) {
        case CUR_FAV.COMIC:
            type = TYPE_COMIC;
            break;
        case CUR_FAV.FICTION:
            type = TYPE_FICTION;
            break;
        case CUR_FAV.VIDEO:
            type = TYPE_VIDEO;
            break;
    }
    getStoreLocal(STOR_KEY_FAVS, function (allFavs) {
        var cols = [];
        log('allFavs', allFavs);
        allFavs = allFavs ? allFavs : [];
        for (var i = 0, len = allFavs.length; i < len; i++) {
            var favItem = allFavs[i],
                colItems = favItem.cols ? favItem.cols : [],
                baseChapter = favItem.baseChapter,
                baseIndex = favItem.baseIndex,
                baseImg = favItem.baseImg;

            if (type && type != favItem.type) continue;
            for (var j = 0, len2 = colItems.length; j < len2; j++) {
                var item = colItems[j];
                item.indexUrl = formatHref(item.indexUrl, baseIndex);
                item.imgUrl = formatHref(item.imgUrl, baseImg);
                item.curUrl = formatHref(item.curUrl, baseChapter);
                item.newUrl = formatHref(item.newUrl, baseChapter);
                item.type = favItem.type;
                item.siteName = favItem.siteName;
                item.origin = favItem.origin;
                item.bgStyle = {backgroundImage: 'url(' + item.imgUrl + ')'};
            }
            cols = cols.concat(colItems);
        }
        //按照阅读的时间进行降序排序
        cols.sort(function (obj1, obj2) {
            var val1 = obj1.timestamp ? obj1.timestamp : 0;
            var val2 = obj2.timestamp ? obj2.timestamp : 0;
            return val2 - val1;
        });
        log('all-cols', cols);
        vContentWrap.curShowFav = curShowFav;
        vContentWrap.items = cols;
    });
}

var vTogglePanel = Vue.component('toggle-fav-panel', {
    props: {
        curShowFav: Number
    },
    data:function () {
        return {
            textArr:['全部','漫画','小说','视频']
        };
    },
    template: `
    <div id="favToggleWrap">
        <span v-for="(text,index) in textArr" :class="{curFav:curShowFav == index}" @click="showFavs(index)" >{{text}}</span>
    </div>
     `,
    methods: {
        showFavs: showFavs,
    }
});