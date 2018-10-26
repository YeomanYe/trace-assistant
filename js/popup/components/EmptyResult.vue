<template>
    <div id="emptyResult">
        <img src="../../../images/empty-box.png">
        <p>没有任何内容</p>
    </div>
</template>

<script>
    export default {

    }
</script>

<style lang="scss">
    #emptyResult{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        p{
            font-size: 40px;
            text-align: center;
            color: rgb(138,138,138);
        }
        img{
            width: 300px;
        }
    }
</style>
