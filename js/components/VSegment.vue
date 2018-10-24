<template>
    <div class="segment">
        <span v-for="(data,index) in datas" :class="{curSegment:cur === index}"
              @click="onClick(data.value || index)">{{data.text}}</span>
    </div>
</template>

<script>
    import LocalStore from '../utils/LocalStore';

    export default {
        props:['datas','onClick','cur'],
    }

</script>

<style rel="stylesheet/scss" lang="scss">
    @import "../../css/popup";

    .segment {
        font-size: 0px; /* 出自http://www.zhangxinxu.com/wordpress/2012/04/inline-block-space-remove-%E5%8E%BB%E9%99%A4%E9%97%B4%E8%B7%9D/ 去除元素之间空隙 */
        padding: 10px 0;
        transform: translate(25%, 0%);
        span {
            display: inline-block;
            padding: 5px 15px;
            font-size: 15px;
            background: $themeColorLight;
            margin: 0;
            color: white;
            cursor: pointer;
        }
        .curSegment {
            background: $themeColor;
            color: white;
        }
    }
</style>
