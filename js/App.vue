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
    /*元素样式设置*/
    * {
        margin: 0;
        padding: 0;
    }

    body {
        width: 430px;
        height: $sumHeight;
    }

    a {
        text-overflow: ellipsis;
        white-space: nowrap;
        @include linkColor(blue);
    }

    .pointer{
        cursor: pointer;
    }

</style>
