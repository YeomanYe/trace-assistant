<template>
    <div>
        <div v-if="curPanel === 0" id="contentFavWrap" class="listWrap">
            <batch-panel/>
            <!--切换收藏类型的按钮-->
            <v-segment :cur="curFavType" :datas="segmentDatas" :onClick="setCurFav"/>
            <!-- 收藏的漫画列表 -->
            <fav-list/>
            <empty-result v-show="displayFavs.length === 0"/>
        </div>
        <div v-else-if="curPanel === 1" id="contentSettingWrap" class="listWrap">
            <!-- 设置列表 -->
            <setting-panel/>
        </div>
    </div>
</template>

<script>
    import BatchPanel from '../components/BatchPanel';
    import FavList from '../components/FavList';
    import EmptyResult from '../components/EmptyResult';
    import SettingPanel from '../components/SettingPanel';
    import {mapGetters, mapState, mapActions} from 'vuex';
    import VSegment from '../components/VSegment';

    export default {
        data:()=>({segmentDatas:[{text:'全部'},{text:'漫画'},{text:'小说'},{text:'视频'}]}),
        created() {
            this.queryFav();
            this.loadStatus();
        },
        methods: {
            ...mapActions(['queryFav','loadStatus']),
            ...mapActions({
                setCurFav: (dispatch, curFavType) => {
                    dispatch('saveStatus', {curFavType});
                },
            })
        },
        components: {VSegment, BatchPanel, FavList, EmptyResult, SettingPanel},
        computed: {
            ...mapState({
                curPanel: state => state.ui.curPanel,
                curFavType: state => state.ui.curFavType
            }),
            ...mapGetters(['displayFavs']),
        }
    }
</script>
