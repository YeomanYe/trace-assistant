<template>
    <div>
        <search-panel v-if="isSearch"/>
        <toolbar v-else/>
    </div>
</template>

<script>
    import SearchPanel from '../components/SearchPanel';
    import Toolbar from '../components/Toolbar';
    import {mapState} from 'vuex';

    export default {
        components:{SearchPanel,Toolbar},
        computed:{
            ...mapState({
                isSearch:state => state.ui.isSearch
            }),
        }
    }
</script>
