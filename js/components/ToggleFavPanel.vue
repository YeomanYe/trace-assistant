
<template>
    <div id="favToggleWrap">
        <span v-for="(text,index) in textArr" :class="{curFav:curFavType == index}" @click="setCurFav(index)" >{{text}}</span>
    </div>
</template>

<script>
    import LocalStore from '../utils/LocalStore';
    import {mapState,mapActions} from 'vuex';

    export default {
        data:function () {
            return {
                textArr:['全部','漫画','小说','视频']
            };
        },
        methods: {
            ...mapActions({
                setCurFav:(dispatch,curFavType) => {
                    dispatch('saveStatus',{curFavType});
                }
            })
        },
        computed:{
            ...mapState({
                curFavType:state => state.ui.curFavType
            })
        }
    }

</script>
