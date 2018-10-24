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
