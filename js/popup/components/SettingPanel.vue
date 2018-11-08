<template>
    <ul id="settingList" class="list">
        <!--<legend><img src="images/all-setting.png"/><span>全部设置</span></legend>-->
        <li><i class="fa fa-cloud-download font-icon"/><span @click="exportHandler" id="export">导出收藏</span></li>
        <li><i class="fa fa-cloud-download font-icon"/><span @click="importHandler" title="注意：导入收藏会覆盖当前所有的收藏" id="import">导入收藏</span></li>
        <li><span>桌面提醒</span><toggle-button :value="!isCloseTips" @change="setIsCloseTips" color="black"/></li>
        <input @change="fileImportChangeHandler" type="file" hidden name="fileImport" id="fileImport">
    </ul>
</template>

<script>
    import Constant from '../../Constant';
    import LocalStore from '../../utils/LocalStore';
    import * as FileSaver from 'file-saver';
    import {sendMsg} from '../../utils/ExtUtil';
    import {mapActions} from 'vuex';
    import {mapModel} from '../../utils/VueUtil';

    const {STOR_KEY_FAVS,STOR_KEY_IS_CLOSE_TIPS,TYPE_COMIC,BG_CMD_UPDATE_NUM} = Constant;
    export default {
        methods: {
            importHandler:function () {
                document.getElementById('fileImport').click();
            },
            exportHandler:async function (e) {
                let [allFavs,isCloseTips] = await LocalStore.load([STOR_KEY_FAVS,STOR_KEY_IS_CLOSE_TIPS]);
                let blob = new Blob([JSON.stringify({allFavs,isCloseTips})], {
                    type: 'text/plain;charset=utf-8'
                });
                FileSaver.saveAs(blob, '追综饭.json');
            },
            fileImportChangeHandler:function (e) {
                let files = e.currentTarget.files;
                let self = this;
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
                        self.queryFav();
                    };
                    reader.readAsText(file);
                }
                e.currentTarget.value = '';
            },
            ...mapActions(['queryFav','setIsCloseTips'])
        },
        computed:{
            ...mapModel([{ns:'ui',names:['isCloseTips']}])
        }
    }
</script>

<style lang="scss">
    #settingList {
        margin-top:10px;
        li {
            text-align: center;
            border-bottom: 1px solid #ccc;
            padding: 10px 0;
            &:first-child{
                padding-top: 0;
            }
            span {
                font-size: 18px;
                vertical-align: middle;
                cursor: pointer;
                color: #999;
                margin-right: 15px;
            }
            img {
                width: 35px;
                margin-bottom: -10px;
                margin-right: 15px;
            }
        }
        legend {
            border-bottom: 2px solid #777;
            font-size: 18px;
            color: #123;
            padding: 10px;
            img {
                width: 35px;
                margin-bottom: -10px;
                margin-right: 10px;
            }
        }
        .font-icon{
            font-size: 24px;
            margin-right: 10px;
            vertical-align: bottom;
        }
    }
</style>
