<template>
    <header v-show="isSearch" id='search'>
        <div class="hd">
            <i class="fa fa-search"/>
        </div>
        <div class="bd">
            <input v-input-focus="true" autofocus v-model.trim="searchText" type="text">
        </div>
        <div class="fd">
            <a @click="cancelSearch" class="pointer">取消</a>
        </div>
    </header>
</template>

<script>
    import {mapState,mapActions} from 'vuex';
    import {mapModel} from '../utils/VueUtil';

    export default {
        methods: {
            ...mapActions({
                cancelSearch:(dispatch) => {
                    dispatch('saveStatus',{isSearch:false,searchText:''})
                }
            })
        },
        computed:{
            ...mapState({
                isSearch:state => state.ui.isSearch
            }),
            ...mapModel([{ns:'ui',names:['searchText']}])
        },
        directives: {
            'input-focus'(el, binding) {
                if (binding.value) {
                    el.focus();
                }
            }
        }
    }
</script>
