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
            var tmpArr = [];

            if (type && type != favItem.type) continue;
            for (var j = 0, len2 = colItems.length; j < len2; j++) {
                var item = colItems[j],obj = Object.assign({},item);
                obj.indexUrl = formatHref(item.indexUrl, baseIndex);
                obj.imgUrl = formatHref(item.imgUrl, baseImg);
                obj.curUrl = formatHref(item.curUrl, baseChapter);
                obj.newUrl = formatHref(item.newUrl, baseChapter);
                obj.type = favItem.type;
                obj.siteName = favItem.siteName;
                obj.origin = favItem.origin;
                // obj.bgStyle = {backgroundImage: 'url(' + obj.imgUrl + ')'};
                tmpArr.push(obj);
            }
            cols = cols.concat(tmpArr);
        }
        //按照阅读的时间进行降序排序
        cols.sort(function (obj1, obj2) {
            var val1 = obj1.timestamp ? obj1.timestamp : 0;
            var val2 = obj2.timestamp ? obj2.timestamp : 0;
            return val2 - val1;
        });
        //有更新的排在前头
        var tmpArr1 = [],tmpArr2 = [];
        for(i=0,len=cols.length;i<len;i++){
            var c = cols[i];
            if(c.isUpdate) {
                tmpArr1.push(c);
            }else{
                tmpArr2.push(c);
            }
        }
        cols = tmpArr1.concat(tmpArr2);
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