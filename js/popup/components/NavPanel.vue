<template>
    <nav id="nav">
        <span v-for="(text,index) in textArr" @click="setPanel(index)"  :class="{curTab:curPanel === index}">{{text}}</span>
    </nav>
</template>

<script>
    import vContentWrap from '../App';
    import Constant from '../../Constant';
    import LocalStore from '../../utils/LocalStore';
    import {mapActions,mapState} from 'vuex';

    export default {
        props: {
            curShow: Number
        },
        data:function () {
            return {
                textArr:['收藏','设置']
            };
        },
        computed:{
            ...mapState({
                curPanel:state => state.ui.curPanel
            })
        },
        methods: {
            ...mapActions({
                setPanel:(dispatch,curPanel) => {
                    dispatch('saveStatus',{curPanel});
                }
            }),
        },
    }
</script>

<style lang="scss">
    @import "../../../css/popup";

    .curTab {
        background: $themeColor;
        color: white;
    }

    nav {
        font-size: 0px;
        span {
            display: inline-block;
            margin: 0;
            padding: 10px 89px;
            font-size: 18px;
            cursor: pointer;
            color: black;
            background: white;
        }
    }
</style>
