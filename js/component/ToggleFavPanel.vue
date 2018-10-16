
<template>
    <div id="favToggleWrap">
        <span v-for="(text,index) in textArr" :class="{curFav:curShowFav == index}" @click="showFavs(index)" >{{text}}</span>
    </div>
</template>

<script>
    // let vTogglePanel = Vue.component('toggle-fav-panel', );
    import vContentWrap from '../App';
    import Constant from '../constant';
    const {TYPE_COMIC,CUR_FAV,TYPE_FICTION,TYPE_VIDEO,STOR_KEY_FAVS} = Constant;

    export default {
        props: {
            curShowFav: Number
        },
        data:function () {
            return {
                textArr:['全部','漫画','小说','视频']
            };
        },
        methods: {
            showFavs: showFavs,
        }
    }
    function showFavs(curShowFav) {
        let type = undefined;
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
            let cols = [];
            log('allFavs', allFavs);
            allFavs = allFavs ? allFavs : [];
            for (let i = 0, len = allFavs.length; i < len; i++) {
                let favItem = allFavs[i],
                    colItems = favItem.cols ? favItem.cols : [],
                    baseChapter = favItem.baseChapter,
                    baseIndex = favItem.baseIndex,
                    baseImg = favItem.baseImg;
                let tmpArr = [];

                if (type && type !== favItem.type) continue;
                let searchText = vContentWrap.searchText;
                for (let j = 0, len2 = colItems.length; j < len2; j++) {
                    let item = colItems[j],obj = Object.assign({},item);
                    obj.indexUrl = formatHref(item.indexUrl, baseIndex);
                    obj.imgUrl = formatHref(item.imgUrl, baseImg);
                    obj.curUrl = formatHref(item.curUrl, baseChapter);
                    obj.newUrl = formatHref(item.newUrl, baseChapter);
                    obj.type = favItem.type;
                    obj.siteName = favItem.siteName;
                    obj.origin = favItem.origin;
                    if(searchText && item.title.indexOf(searchText) < 0) continue;
                    tmpArr.push(obj);
                }
                cols = cols.concat(tmpArr);
            }
            log('all-cols', cols);
            vContentWrap.curShowFav = curShowFav;
            vContentWrap.items = cols;
            sortFavItems();
        });
    }

    /**
     * 排序显示收藏项
     * @returns {*[]}
     */
    function sortFavItems() {
        let cols = vContentWrap.items;
        //按照阅读的时间进行降序排序
        cols.sort(function (obj1, obj2) {
            let val1 = obj1.timestamp ? obj1.timestamp : 0;
            let val2 = obj2.timestamp ? obj2.timestamp : 0;
            return val2 - val1;
        });
        //有更新的排在前头
        let tmpArr1 = [],tmpArr2 = [];
        for(let i=0,len=cols.length;i<len;i++){
            let c = cols[i];
            if(c.isUpdate) {
                tmpArr1.push(c);
            }else{
                tmpArr2.push(c);
            }
        }
        vContentWrap.items =  Object.assign([],tmpArr1.concat(tmpArr2));
    }

</script>
