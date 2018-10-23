<template>
    <div id="batchPanel" v-if="isBatch">
        <!-- checkbox -->
        <div class="pretty p-svg p-curve">
            <input @click="invertFavCheck()" type="checkbox" />
            <div class="state p-success">
                <!-- svg path -->
                <svg class="svg svg-icon" viewBox="0 0 20 20">
                    <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                </svg>
                <label ></label>
            </div>
        </div>
        <!-- 删除 -->
        <div class="inline-right">
            <a class="pointer" @click="batchDel()">删除</a>
            <a class="pointer" @click="batchMarkRead()">标为已读</a>
        </div>
    </div>
</template>

<script>
    import Constant from '../constant';
    import eventHub from '../utils/EventHub';
    import vContentWrap from '../App';
    import {mapActions,mapState,mapGetters} from 'vuex';

    const {EVT_BATCH_DEL,EVT_BATCH_MARK_READ} = Constant;
    export default {
        props: {
            hide:Boolean
        },
        methods: {
            invertSelection:function(){
                /*let allItems = vContentWrap.items;
                for(let i=0,len=allItems.length;i<len;i++){
                    let item = allItems[i];
                    let index = arrEqObj(_selectedFavs,{index:i});
                    if(index < 0){
                        item.checkState = true;
                        _selectedFavs.push({index:i,item:item})
                    }else{
                        item.checkState = false;
                        _selectedFavs.splice(index,1);
                    }
                }
                vContentWrap.items = Object.assign([],allItems);
                console.log('invertSelection',_selectedFavs);*/
                console.log('invertSelection',this.displayFavs);
                /*for(let item of this.displayFavs){
                    item.checkState = !item.checkState;
                }*/
                this.selectDisFav(null,true);
            },
            batchMarkRead:function(){
                eventHub.$emit(EVT_BATCH_MARK_READ);
            },
            batchDel:function () {
                eventHub.$emit(EVT_BATCH_DEL);
            },
            ...mapActions(['invertFavCheck'])
        },
        computed:{
            ...mapState({
                isBatch:state => state.ui.isBatch
            }),
            ...mapGetters(['displayFavs','selectDisFav'])
        }
    }
// let vBatchPanel = Vue.component('batch-panel', );
</script>
