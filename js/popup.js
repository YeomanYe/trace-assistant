var storLocal = chrome.storage.local;
var log = console.log;
var _allFavs;
var $optionTab,$colTab,$comicList,$settingList,$export,$import;
storLocal.get('allFavs',function(resObj){
    log(resObj);
    $optionTab = $('#optionTab').on('click',optionTabHandler);
    $colTab = $('#colTab').on('click',colTabHandler);
    $export = $('#export').on('click',exportHandler);
    $import = $('#import').on('click',importHandler);
    $comicList = $('#comicList');
    $settingList = $('#settingList');
    $settingList.hide();
    _allFavs = resObj.allFavs;
    _allFavs.forEach(resolveColItem);
});
/**
 * 点击收藏tab事件
 */
function colTabHandler(){
    $comicList.show();
    $settingList.hide();
    $colTab.addClass('curTab');
    $optionTab.removeClass('curTab');
}
/**
 * 点击设置tab事件
 */
function optionTabHandler(){
    $comicList.hide();
    $settingList.show();
    $optionTab.addClass('curTab');
    $colTab.removeClass('curTab');
}
/**
 * 处理每一个网站收藏的漫画
 */
function resolveColItem(colItem,colIndex){
    var baseImg = colItem.baseImg,
        baseIndex = colItem.baseIndex,
        baseChapter = colItem.baseChapter,
        origin = colItem.origin,
        cols = colItem.cols;
    log(baseImg,baseIndex);
    cols.forEach(function(obj,index){
        liTempStr = $('#listItemTemplate').html();
        $liInstance = $(liTempStr);
        $liInstance.find('.left div').css({
            'background-image':'url('+baseImg + obj.imgUrl+')',
            'background-size':'cover',
            'background-repeat':'no-repeat'
        });
        $liInstance.find('.left').attr({
            href:baseIndex + obj.indexUrl,
            target:'_blank'
        });
        $liInstance.find('.middle h3 .titleName').text(obj.title).attr({
           href:baseIndex + obj.indexUrl,
           target:'_blank' 
        });
        $liInstance.find('.middle .news').text('最新：'+obj.newChapter).attr({
           href:baseChapter + obj.newUrl,
           target:'_blank'  
        });
        $liInstance.find('.middle .current').text('看到：'+obj.curChapter).attr({
           href:baseChapter + obj.curUrl,
           target:'_blank'  
        });
        $liInstance.find('.right .source').text(getSiteName(origin)).attr({
            href:origin,
            target:'_blank'
        });
        $liInstance.find('.right .delBtn').text('删除').attr('data-index',colIndex+','+index).on('click',delCollect);
        $liInstance.find('.right .contBtn').text('继续阅读').attr({
            href:baseChapter + obj.curUrl,
            target:'_blank'
        });
        //添加最新按钮
        if(obj.isUpdate){
            $liInstance.find('.middle .news-badge').css('display','inline-block').attr({
                href:baseChapter + obj.newUrl,
                target:'_blank'  
            });
        }
        
        log($liInstance);
        $comicList.append($liInstance);
    });
}

function exportHandler(){
    /*chrome.storage.local.get(["MANIFEST", "OPTIONS", "CONFIG", "SITECONF", "CACHE", "LANG"], function(storage) {
            chrome.runtime.sendMessage({ type: 'db', fun: 'getFavList' }, function(result) {
                var data = {
                    storage: storage,
                    favList: result
                };
                var blob = new Blob([JSON.stringify(data)], { type: "text/plain;charset=utf-8" });
                saveAs(blob, "漫神器.json");
            });
        });*/
    storLocal.get(['allFavs,updateNum'],function(resObj){
        var blob = new Blob([JSON.stringify(resObj)], { type:'text/plain;charset=utf-8' });
        saveAs(blob, 'ComicList.json');
    });
}

function importHandler(){

}

/* $("#file_import").change(function(e) {
        var files = this.files;
        if (files.length) {
            var file = files[0],
                reader = new FileReader(); //new一个FileReader实例

            reader.onload = function() {
                var data = JSON.parse(this.result);
                chrome.storage.local.set({
                    "MANIFEST": data.storage.MANIFEST,
                    "OPTIONS": data.storage.OPTIONS,
                    "CONFIG": data.storage.CONFIG,
                    "SITECONF": data.storage.SITECONF,
                    "CACHE": data.storage.cache,
                    "LANG": data.storage.LANG
                });
                var favList = adapterData(data.favList);
                for(var i=0,len=favList.length;i<len;i++){
                    chrome.runtime.sendMessage({ type: 'db', fun: 'addFav', params:favList[i] }, new Function());
                }
            };
            reader.readAsText(file);
        }
        chrome.storage.local.set({});
    });*/
/**
 * 删除收藏的漫画
 */
function delCollect(e){
    //删除UI
    $(this).parents('li').remove();
    //从本地存储中删除
    var indexArr = $(this).data('index').split(',');
    _allFavs[indexArr[0]].cols.splice(indexArr[1],1);
    log('_allFavs',_allFavs);
    storLocal.set({
      allFavs:_allFavs
    });
}
/**
 * 根据站点url获得网站名称
 * @param  {string} site 站点url
 */
function getSiteName(site){
    var name;
    if(site.indexOf('kuaikan') >= 0){
        name = '快看漫画';
    }
    return name;
}