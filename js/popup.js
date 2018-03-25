var vContentWrap;
var switchTipsElm;
showFavs(0);
function showFavs(curShowFav) {
    var type = undefined;
    switch (curShowFav){
        case 1:type = TYPE_COMIC;break;
        case 2:type = TYPE_FICTION;break;
        case 3:type = TYPE_VIDEO;break;
    }
    getStoreLocal('allFavs', function (allFavs) {
        var cols = [];
        log('allFavs',allFavs);
        allFavs = allFavs ? allFavs : [];
        for (var i = 0, len = allFavs.length; i < len; i++) {
            var favItem = allFavs[i],
                colItems = favItem.cols ? favItem.cols : [],
                baseChapter = favItem.baseChapter,
                baseIndex = favItem.baseIndex,
                baseImg = favItem.baseImg;

            if(type && type != favItem.type) continue;
            for (var j = 0, len2 = colItems.length; j < len2; j++) {
                var item = colItems[j];
                item.indexUrl = formatHref(item.indexUrl,baseIndex);
                item.imgUrl = formatHref(item.imgUrl,baseImg);
                item.curUrl = formatHref(item.curUrl,baseChapter);
                item.newUrl = formatHref(item.newUrl,baseChapter);
                item.type = favItem.type;
                item.siteName = favItem.siteName;
                item.origin = favItem.origin;
                item.bgStyle = {backgroundImage:'url('+item.imgUrl+')'};
            }
            cols = cols.concat(colItems);
        }
        //按照阅读的时间进行降序排序
        cols.sort(function (obj1,obj2) {
            var val1 = obj1.timestamp ? obj1.timestamp : 0;
            var val2 = obj2.timestamp ? obj2.timestamp : 0;
            return val2 - val1;
        });
        log('all-cols',cols);
        if(vContentWrap === undefined) initView(cols);
        else {
            vContentWrap.curShowFav = curShowFav;
            vContentWrap.items = cols;
        }
    });
}
/**
 *初始化视图
 */
function initView(cols) {
    vContentWrap = new Vue({
        el:'#contentWrap',
        data:{
            curShow:0,//当前显示的tab内容
            items: cols,//收藏的集合
            curShowFav:0 //当前显示的收藏
        },
        methods:{
            importHandler:function () {
                document.getElementById('fileImport').click();
            },
            exportHandler:function (e) {
                storLocal.get(['allFavs', 'updateNum'], function (resObj) {
                    log('export obj', resObj);
                    var blob = new Blob([JSON.stringify(resObj)], {
                        type: 'text/plain;charset=utf-8'
                    });
                    saveAs(blob, '追综饭.json');
                });
            },
            fileImportChangeHandler:function (e) {
                var files = e.currentTarget.files;
                if (files.length) {
                    var file = files[0],
                        reader = new FileReader(); //new一个FileReader实例
                    reader.onload = function () {
                        var data = JSON.parse(this.result);
                        var allFavs = data.allFavs;
                        //兼容老版本
                        for(var i=0,len=allFavs.length;i<len;i++){
                            var favItem = allFavs[i];
                            favItem.type = favItem.type ? favItem.type : TYPE_COMIC;
                        }
                        storLocal.set(data,function () {
                            sendMsg(null, [BG_CMD_UPDATE_NUM]);
                        });
                        showFavs(vContentWrap.curShowFav);
                    };
                    reader.readAsText(file);
                }
            },
            showContentToggle:function (contentId) {
                vContentWrap.curShow = contentId;
                if(contentId == 1){
                    if(switchTipsElm)return;
                    getStoreLocal('isCloseTips',function (status) {
                        status = !status;
                        switchTipsElm = new Switch(document.getElementById('switchTips'), {size: 'middle',onChange:function (e) {
                            var checked = switchTipsElm.getChecked();
                            storLocal.set({'isCloseTips':!checked});
                        }});
                        if(status) switchTipsElm.on();
                    });
                }
            },
            showFavs:showFavs,
            delFavItem:function (index,item) {
                //更新视图
                vContentWrap.items.splice(index,1);
                //更新存储
                var origin = item.origin,type = item.type,title = item.title;
                getStoreLocal('allFavs', function (allFavs) {
                    var index = arrEqStr(allFavs,{origin:origin,type:type});
                    var cols = allFavs[index].cols;
                    index = arrEqStr(cols,{title:title});
                    var delArr = cols.splice(index,1);
                    decUpdateNum(delArr[0]);
                    sendMsg(null,[BG_CMD_UPDATE_FAV_BTN]);
                    log('allFavs', allFavs);
                    storLocal.set({
                        allFavs: allFavs
                    });
                });
            }
        }
    });
}