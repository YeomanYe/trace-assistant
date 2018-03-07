if (location.href.indexOf('ac.qq') >= 0) {
    var origin = location.origin,
        baseImgUrl = 'https://manhua.qpic.cn/vertical/',
        baseChapterUrl = origin + 'ComicView/index/id/',
        baseIndexUrl = origin + '/Comic/comicInfo/id/';

    var storObj = {
        baseImg: baseImgUrl,
        baseIndex: baseIndexUrl,
        baseChapter: baseChapterUrl,
        origin: origin,
        site: 'ac.qq'
    };
}

$(function(){
    _$imgExport.on('click',exportUserCol);
});

function exportUserCol(){
    $.ajax('http://ac.qq.com/MyPersonalCenter/getUserCollection',{success:function(text){
        var userCols = JSON.parse(text).data;
        getFavs('allFavs',storObj,function(cols,allFavs){
            for(var i=0,len=userCols.length;i<len;i++){
                var item =userCols[i];
                var index = arrInStr(cols,item.title,'title');
                //当收藏中没有该漫画时才添加
                if(index < 0) {
                    var col = {
                        imgUrl: item.coverUrl.replace(baseImgUrl, ''),
                        indexUrl: item.id,
                        newChapter:'第'+item.nextSeqNo+'话',
                        curChapter:'第' + item.lateSeqNo + '话',
                        newUrl: item.id+'/seqno/'+item.lateSeqNo, //最新章节地址
                        curUrl: item.id+'/seqno/'+item.nextSeqNo, //当前章节地址
                        title: item.title,
                        isUpdate: false
                    };
                    cols.push();
                }
            }
        });
    }});
}
/**
 * 获取章节信息
 */
function getChapterInfo(chapterNum){

}