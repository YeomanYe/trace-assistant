<template>
    <div>
        <div v-if="curPanel === 0" id="contentFavWrap" class="listWrap">
            <batch-panel/>
            <!--切换收藏类型的按钮-->
            <toggle-fav-panel/>
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
    import ToggleFavPanel from '../components/ToggleFavPanel';
    import FavList from '../components/FavList';
    import EmptyResult from '../components/EmptyResult';
    import SettingPanel from '../components/SettingPanel';
    import {mapGetters, mapState, mapActions} from 'vuex';

    export default {
        created() {
            this.queryFav();
        },
        methods: {
            ...mapActions(['queryFav'])
        },
        components: {BatchPanel, ToggleFavPanel, FavList, EmptyResult, SettingPanel},
        computed: {
            ...mapState({
                curPanel: state => state.ui.curPanel
            }),
            ...mapGetters(['displayFavs']),
        }
    }
</script>
