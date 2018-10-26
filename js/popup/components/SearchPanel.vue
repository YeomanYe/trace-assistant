<template>
    <header id='search'>
        <div class="hd">
            <i class="fa fa-search"/>
        </div>
        <div class="bd">
            <input v-input-focus="true" v-model.trim="searchText" type="text">
        </div>
        <div class="fd">
            <a @click="cancelSearch" class="pointer">取消</a>
        </div>
    </header>
</template>

<script>
    import {mapState,mapActions} from 'vuex';
    import {mapModel} from '../../utils/VueUtil';

    export default {
        methods: {
            ...mapActions({
                cancelSearch:(dispatch) => {
                    dispatch('saveStatus',{isSearch:false,searchText:''})
                }
            })
        },
        computed:{
            ...mapModel([{ns:'ui',names:['searchText']}])
        },
        directives: {
            'input-focus'(el, binding) {
                console.log('input-focus',binding,el);
                if (binding.value) {
                    el.focus();
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "../../../css/popup";
    #search{
        background: $themeColor;
        padding: 8px;
        width: 100%;
        div{
            display: inline-block;
        }
        .bd{
            width: 75%;
            padding-top: 5px;
            border: none;
            input{
                width: 100%;
                height: 20px;
                padding-left: 7px;
            }
        }
        .hd{
            float: left;
        }
        .fd{
            margin-left: 15px;
            font-size: 15px;
            margin-top: 3px;
            a{
                color: white;
            }
        }
        i{
            font-size: 25px;
            color: white;
            margin-top: 3px;
            margin-right: 10px;
        }
    }
</style>
