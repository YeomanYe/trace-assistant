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
    import Constant from '../../Constant';
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

<style lang="scss">
    #batchPanel{
        .inline-right{
            display: inline-block;
            float: right;
        }
        a{
            color:rgb(78, 144, 232);
            margin-right: 10px;
            &:last-child{
                margin-right: 0px;
            }
        }
        padding: 8px 15px;
        background: rgb(241,218,75);
    }

</style>
