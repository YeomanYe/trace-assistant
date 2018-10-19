<template>
    <header id='toolbar'>
        <div class="hd">
            <img src="../../images/icon/logo-white32.png" alt=""/>
            <h1>追综饭</h1>
        </div>
        <template v-for="(bdObj,index) in bdArr" >
            <a target="_blank" @click="onClick(index,bdObj)" :style="bdObj.wrapStyle" :title="bdObj.title" :href="bdObj.href">
                <i class="fa" :class="bdObj.icon"/>
            </a>
        </template>
    </header>
</template>

<script>
    // var vToolbar = Vue.component('toolbar', )
    import {mapState,mapActions} from 'vuex';

    export default {
        props: {
            batch:Boolean
        },
        data: function () {
            return {
                bdArr: [
                    {
                        title: '给个好评',
                        icon:'fa-thumbs-o-up',
                        wrapStyle:'margin-top:1px;',
                        href: 'https://chrome.google.com/webstore/detail/%E8%BF%BD%E7%BB%BC%E9%A5%AD/fajeglfbhflmbaccedmbgelodcbljobl/reviews?utm_source=chrome-ntp-icon'
                    },
                    {title: '批量操作',icon:'fa-list',wrapStyle:'margin-top:3px;'},
                    {title:'搜索',icon:'fa-search'}
                ]
            }
        },
        methods: {
            onClick:function(index){
                switch(index){
                    case 0:break;
                    case 1:this.toggleBatch();break;
                    case 2:this.toggleSearch();break;
                }
            },
            ...mapActions(['toggleBatch','toggleSearch'])
        },
    }
</script>
