<template>
    <ul id="settingList" class="list">
        <!--<legend><img src="images/all-setting.png"/><span>全部设置</span></legend>-->
        <li><i class="fa fa-cloud-download font-icon"/><span @click="exportHandler" id="export">导出收藏</span></li>
        <li><i class="fa fa-cloud-download font-icon"/><span @click="importHandler" title="注意：导入收藏会覆盖当前所有的收藏" id="import">导入收藏</span></li>
        <li><span>桌面提醒</span><input class="checkbox-switch" type="checkbox" id="switchTips"/></li>
        <input @change="fileImportChangeHandler" type="file" hidden name="fileImport" id="fileImport">
    </ul>
</template>

<script>
    // let vSettingPanel = Vue.component('setting-panel', );
    import Constant from '../constant';
    import vContentWrap from '../App';
    import LocalStore from '../utils/LocalStore';

    const {STOR_KEY_UPDATE_NUM,STOR_KEY_FAVS,TYPE_COMIC,BG_CMD_UPDATE_NUM} = Constant;
    export default {
        methods: {
            importHandler:function () {
                document.getElementById('fileImport').click();
            },
            exportHandler:async function (e) {
                // sendToCurTab([CNT_CMD_EXOPORT_FAV]);
                /*storLocal.get([STOR_KEY_FAVS, STOR_KEY_UPDATE_NUM], function (resObj) {
                    log('export obj', resObj);
                    let blob = new Blob([JSON.stringify(resObj)], {
                        type: 'text/plain;charset=utf-8'
                    });
                    saveAs(blob, '追综饭.json');
                })*/
                let allFavs = await LocalStore.load(STOR_KEY_FAVS);
                let blob = new Blob([JSON.stringify({allFavs})], {
                    type: 'text/plain;charset=utf-8'
                });
                saveAs(blob, '追综饭.json');
            },
            fileImportChangeHandler:function (e) {
                let files = e.currentTarget.files;
                if (files.length) {
                    let file = files[0],
                        reader = new FileReader(); //new一个FileReader实例
                    reader.onload = async function () {
                        let data = JSON.parse(this.result);
                        let allFavs = data.allFavs;
                        //兼容老版本
                        for(let i=0,len=allFavs.length;i<len;i++){
                            let favItem = allFavs[i];
                            favItem.type = favItem.type ? favItem.type : TYPE_COMIC;
                        }
                        await LocalStore.save(data);
                        sendMsg(null, [BG_CMD_UPDATE_NUM]);
                        /*storLocal.set(data,function () {
                            sendMsg(null, [BG_CMD_UPDATE_NUM]);
                        });*/
                        showFavs(vContentWrap.curShowFav);
                    };
                    reader.readAsText(file);
                }
                e.currentTarget.value = '';
            },
        }
    }
</script>
