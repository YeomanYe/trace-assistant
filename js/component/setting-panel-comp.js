var vSettingPanel = Vue.component('setting-panel', {
    template: `
    <ul id="settingList" class="list">
            <legend><img src="images/all-setting.png"/><span>全部设置</span></legend>
            <li><img src="images/download.png"/><span @click="exportHandler" id="export">导出收藏</span></li>
            <li><img src="images/upload.png"/><span @click="importHandler" title="注意：导入收藏会覆盖当前所有的收藏" id="import">导入收藏</span></li>
            <li><span>桌面提醒</span><input class="checkbox-switch" type="checkbox" id="switchTips"/></li>
            <input @change="fileImportChangeHandler" type="file" hidden name="fileImport" id="fileImport">
        </ul>
     `,
    methods: {
        importHandler:function () {
            document.getElementById('fileImport').click();
        },
        exportHandler:function (e) {
          sendToCurTab([CNT_CMD_EXOPORT_FAV]);
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
    }
});