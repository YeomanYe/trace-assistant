var vFavItem = Vue.component('fav-list', {
  props: {
    items: Array
  },
  template: `
<ul id="favList" class="list">
    <li v-for="(item,index) in items"   :key="item.indexUrl">
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
            <div @click.once="delFavItem(index,item)" class="delBtn">删除</div>
            <div><a :href="item.curUrl" target="_blank" class="contBtn">{{item.type === 'video' ? '继续观看' : '继续阅读'}}</a></div>
        </div>
    </li>
    </ul>
     `,
  methods: {
    imgLoseHandler: function (event) {
      event.target.src = 'images/lose.png'
    },
    delFavItem: function (index, item) {
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
  }
})