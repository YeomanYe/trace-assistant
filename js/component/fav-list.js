var vFavList = Vue.component('fav-list', {
    props: {
        items: Array,
        batch: Boolean
    },
    template: `
<ul id="favList" class="list">
    <li v-for="(item,index) in items"   :key="item.indexUrl">
    <!-- checkbox -->
    <div v-show="batch" class="wrapCheckbox pretty p-svg p-curve">
            <input v-model="item.checkState" @click="checkboxHandler(index,item)" type="checkbox" />
            <div class="state p-success">
                <!-- svg path -->
                <svg class="svg svg-icon" viewBox="0 0 20 20">
                    <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                </svg>
                <label ></label>
            </div>
        </div>
        <!-- img -->
        <a :href="item.indexUrl" target="_blank" class="left">
            <img :src="item.imgUrl" @error="imgLoseHandler"/>
        </a>
        <div class="middle">
            <h3 class="tiltle"><a :href="item.indexUrl" target="_blank" class="titleName">{{item.title}}</a><a target="_blank" :href="item.newUrl" v-show="item.isUpdate" class="news-badge">news</a></h3>
            <div><a :href="item.curUrl" target="_blank" class="current">{{item.curChapter}}</a></div>
            <div><a :href="item.newUrl" target="_blank" class="news">{{item.newChapter}}</a></div>
        </div>
        <div class="right">
            <div><a :href="item.origin" target="_blank" class="source">{{item.siteName}}</a></div>
            <div class="operBtn"><span @click.once="delFavItem(index,item)">删除</span><span @click="markReadSingle(index,item)">已读</span></div>
            <div><a :href="item.curUrl" target="_blank" class="contBtn">{{item.type === 'video' ? '继续观看' : '继续阅读'}}</a></div>
        </div>
    </li>
    </ul>
     `,
    methods: {
        imgLoseHandler: function (event) {
            event.target.src = 'images/lose.png'
        },
        checkboxHandler:function(index,item){
            let checkState = !item.checkState;
            let i = arrEqStr(_selectedFavs,{index});
            if(checkState && i < 0){
                _selectedFavs.push({index,item});
            }
            else if(i>=0) {
                _selectedFavs.splice(i,1);
            }
            console.log('checkboxHandler',_selectedFavs);
            item.checkState = checkState;
            // console.log(item);
            // eventHub.$emit('test',{data:'test'});
        },
        delFavItem: delFavItem,
        markReadSingle:markReadSingle
    }
});

var _selectedFavs = [];
var eventHub = new Vue();

function _markRead(item, index, allFavs, updateNum){
    if (item.isUpdate) {
        item.isUpdate = false;
        updateNum--;
    }
    //更新视图
    var vItem = vContentWrap.items[index];
    vItem.curUrl = vItem.newUrl;
    vItem.curChapter = vItem.newChapter;
    //更新存储
    var origin = item.origin, type = item.type, title = item.title;
    var i = arrEqStr(allFavs, {origin: origin, type: type});
    var cols = allFavs[i].cols;
    i = arrEqStr(cols, {title: title});
    var col = cols[i];
    col.isUpdate = false;
    col.curUrl = col.newUrl;
    col.curChapter = col.newChapter;
    return updateNum;
}

function markReadSingle(index,item){
    getStoreLocal([STOR_KEY_FAVS,STOR_KEY_UPDATE_NUM], function (allFavs,updateNum) {
        updateNum = _markRead(item,index,allFavs,updateNum);
        storLocal.set({
            [STOR_KEY_FAVS]: allFavs,
            [STOR_KEY_UPDATE_NUM]:updateNum
        }, function () {
            _selectedFavs = [];
            sortFavItems();
            sendToAllTabs([CNT_CMD_UPDATE_CUR_FAV]);
            chrome.runtime.sendMessage(null, [BG_CMD_UPDATE_NUM]);
        })
    });
}

eventHub.$on(EVT_BATCH_MARK_READ,function(){
    _selectedFavs = _selectedFavs.sort(function (a,b) {
        return b.index - a.index;
    });
    console.log('_selectedFavs',_selectedFavs);
    getStoreLocal([STOR_KEY_FAVS,STOR_KEY_UPDATE_NUM], function (allFavs,updateNum) {
        for(var favItem of _selectedFavs){
            var index = favItem.index,
                item = favItem.item;
            item.checkState = false;
            updateNum = _markRead(item,index,allFavs,updateNum);
        }
        storLocal.set({
            [STOR_KEY_FAVS]: allFavs,
            [STOR_KEY_UPDATE_NUM]:updateNum
        }, function () {
            _selectedFavs = [];
            sortFavItems();
            sendToAllTabs([CNT_CMD_UPDATE_CUR_FAV]);
            chrome.runtime.sendMessage(null, [BG_CMD_UPDATE_NUM]);
        })
    })
});

eventHub.$on(EVT_BATCH_DEL,function() {
    _selectedFavs = _selectedFavs.sort(function (a,b) {
        return b.index - a.index;
    });
    getStoreLocal([STOR_KEY_FAVS,STOR_KEY_UPDATE_NUM], function (allFavs,updateNum) {
        for(var favItem of _selectedFavs){
            var index = favItem.index,
                item = favItem.item;
            if (item.isUpdate) {
                item.isUpdate = false;
                updateNum--;
            }
            //更新视图
            vContentWrap.items.splice(index, 1);
            //更新存储
            var origin = item.origin, type = item.type, title = item.title;
            var i = arrEqStr(allFavs, {origin: origin, type: type});
            var cols = allFavs[i].cols;
            i = arrEqStr(cols, {title: title});
            cols.splice(i, 1);

            // sendMsg(null,[BG_CMD_UPDATE_FAV_BTN]);
            log('allFavs', allFavs);
            storLocal.set({
                [STOR_KEY_FAVS]: allFavs,
                [STOR_KEY_UPDATE_NUM]:updateNum
            }, function () {
                sendToAllTabs([CNT_CMD_UPDATE_CUR_FAV]);
                chrome.runtime.sendMessage(null, [BG_CMD_UPDATE_NUM]);
            })
        }
    })
});

function delFavItem(index, item) {
    //更新视图
    vContentWrap.items.splice(index, 1)
    //更新存储
    var origin = item.origin, type = item.type, title = item.title
    getStoreLocal(STOR_KEY_FAVS, function (allFavs) {
        var index = arrEqStr(allFavs, {origin: origin, type: type})
        var cols = allFavs[index].cols
        index = arrEqStr(cols, {title: title})
        var delArr = cols.splice(index, 1)
        decUpdateNum(delArr[0])

        // sendMsg(null,[BG_CMD_UPDATE_FAV_BTN]);
        log('allFavs', allFavs)
        storLocal.set({
            [STOR_KEY_FAVS]: allFavs
        }, function () {
            sendToAllTabs([CNT_CMD_UPDATE_CUR_FAV])
        })
    })
}
