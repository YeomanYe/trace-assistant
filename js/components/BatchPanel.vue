<template>
    <div id="batchPanel" v-if="isBatch">
        <!-- checkbox -->
        <v-checkbox :onClick="() => invertFavCheck()"/>
        <!-- 删除 -->
        <div class="inline-right">
            <a class="pointer" @click="delBatch">删除</a>
            <a class="pointer" @click="markReadBatch">标为已读</a>
        </div>
    </div>
</template>

<script>
    import Constant from '../constant';
    import eventHub from '../utils/EventHub';
    import vContentWrap from '../App';
    import {mapActions,mapState,mapGetters} from 'vuex';
    import VCheckbox from './VCheckbox';

    export default {
        components: {VCheckbox},
        props: {
            hide:Boolean
        },
        methods: {
            ...mapActions(['invertFavCheck','delBatch','markReadBatch'])
        },
        computed:{
            ...mapState({
                isBatch:state => state.ui.isBatch
            }),
            ...mapGetters(['displayFavs','selectDisFav'])
        }
    }
</script>
