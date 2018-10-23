<template>
    <div v-cloak>
        <pop-header/>
        <pop-body/>
        <pop-footer/>
    </div>
</template>

<script>
    import PopHeader from './views/PopHeader';
    import PopBody from './views/PopBody';
    import PopFooter from './views/PopFooter'
    import {mapState} from 'vuex';

    export default {
        components: {PopHeader,PopFooter,PopBody},
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "../css/popup";

</style>
