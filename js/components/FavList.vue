<template>
    <ul id="favList" class="list">
        <li v-for="(item,index) in displayFavs"   :key="item.indexUrl">
            <!-- checkbox -->
            <v-checkbox v-show="isBatch" wrapClass="wrapCheckbox" :checked="favChecks[index]" :onClick="() => toggleFavCheck(index)"/>
            <!-- img -->
            <a :href="item.indexUrl" target="_blank" class="left">
                <img :src="item.imgUrl" @error="imgLoseHandler"/>
            </a>
            <div class="middle">
                <h3 class="tiltle"><a :href="item.indexUrl" target="_blank" class="titleName">{{item.title}}</a><a target="_blank" :href="item.newUrl" v-show="item.isUpdate" class="news-badge">更新</a></h3>
                <div><a :href="item.curUrl" target="_blank" class="current">{{item.curChapter}}</a></div>
                <div><a :href="item.newUrl" target="_blank" class="news">{{item.newChapter}}</a></div>
            </div>
            <div class="right">
                <div><a :href="item.origin" target="_blank" class="source">{{item.siteName}}</a></div>
                <div class="operBtn"><span @click.once="delCol(item)">删除</span><span @click="markRead(item,index)">已读</span></div>
                <div><a :href="item.curUrl" target="_blank" class="contBtn">{{item.type === 'video' ? '继续观看' : '继续阅读'}}</a></div>
            </div>
        </li>
    </ul>
</template>

<script>
import Constant from '../constant';
import LocalStore from '../utils/LocalStore';
import { mapGetters,mapActions,mapState } from 'vuex'
import VCheckbox from './VCheckbox';

export default {
    components: {VCheckbox},
    methods: {
        imgLoseHandler(event) {
            event.target.src = 'images/lose.png'
        },
        ...mapActions(['queryFav','markRead','delCol','toggleFavCheck'])
    },
    computed:{
        ...mapGetters(['displayFavs']),
        ...mapState({
            isBatch: state => state.ui.isBatch,
            favChecks: state => state.favs.favChecks,
        })
    }
}
</script>

<style type="stylesheet/scss" lang="scss">
    @import "../../css/popup";
    h3 {
        a {
            @include linkColor(black);
        }
    }
    .operBtn {
        font-weight: bold;
        cursor: pointer;
        span:first-child{
            padding-right: 5px;
            margin-right: 5px;
            border-right: 1px solid rgb(128,128,128);
        }
    }

    .contBtn {
        color: white;
        background: $themeColor;
        border-radius: 5px;
        display: inline-block;
        padding: 5px 8px;
        @include linkColor(white);
    }

    .source {
        @include linkColor(grey);
    }

    .news-badge {
        background: red;
        margin-left: 10px;
        border-radius: 5px;
        font-weight: normal;
        padding: 3px;
        font-size: 12px;
        @include linkColor(white);
    }

    #favList{
        $coverImgH:92px;
        li {
            width: 100%;
            overflow: hidden;
            margin-top: 10px;
            &:hover {
                background-color: #eee;
            }
        }
        .middle,.right{
            vertical-align: top;
            display: inline-block;
            &,& div{
                margin-top: 12px;
                max-width: 100%;
                overflow: hidden;
            }
        }
        .wrapCheckbox{
            float: left;
            margin-top: $coverImgH / 2;
            margin-left: 15px;
            margin-right: 0px;
        }
        .left img {
            float: left;
            width: 67px;
            height: $coverImgH;
            object-fit: contain;
            border-radius: 8px;
            margin: 5px 20px;
            background-color: rgb(211, 211, 211);
        }
        .middle{
            width: 50%;
        }
        .right {
            margin-top: 0px;
        }
    }
</style>
