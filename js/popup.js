var $optionTab, $colTab, $comicList, $settingList, $export, $import, $fileImport;

$(function() {
    init();
});

function init() {
    $optionTab = $('#optionTab').on('click', optionTabHandler);
    $colTab = $('#colTab').on('click', colTabHandler);
    $export = $('#export').on('click', exportHandler);
    $import = $('#import').on('click', importHandler);
    $fileImport = $('#fileImport').change(fileImportChangeHandler);
    $comicList = $('#comicList');
    $settingList = $('#settingList');
    $settingList.hide();
    getStoreLocal('allFavs',function(allFavs){
        allFavs = allFavs ? allFavs : [];
        allFavs.forEach(resolveColItems);
    });
}
/**
 * 点击收藏tab事件
 */
function colTabHandler() {
    $comicList.show();
    $settingList.hide();
    $colTab.addClass('curTab');
    $optionTab.removeClass('curTab');
}
/**
 * 点击设置tab事件
 */
function optionTabHandler() {
    $comicList.hide();
    $settingList.show();
    $optionTab.addClass('curTab');
    $colTab.removeClass('curTab');
}
/**
 * 处理每一个网站收藏的漫画
 */
function resolveColItems(colItem, colIndex) {
    // $comicList.empty();
    var baseImg = colItem.baseImg,
        baseIndex = colItem.baseIndex,
        baseChapter = colItem.baseChapter,
        origin = colItem.origin,
        cols = colItem.cols;
    log(baseImg, baseIndex);
    cols.forEach(function(obj, index) {
        liTempStr = $('#listItemTemplate').html();
        $liInstance = $(liTempStr);
        $liInstance.find('.left div').css({
            'background-image': 'url(' + baseImg + obj.imgUrl + ')',
            'background-size': 'cover',
            'background-repeat': 'no-repeat'
        });
        $liInstance.find('.left').attr({
            href: baseIndex + obj.indexUrl,
            target: '_blank'
        });
        $liInstance.find('.middle h3 .titleName').text(obj.title).attr({
            href: baseIndex + obj.indexUrl,
            target: '_blank'
        });
        $liInstance.find('.middle .news').text('最新：' + obj.newChapter).attr({
            href: baseChapter + obj.newUrl,
            target: '_blank'
        });
        $liInstance.find('.middle .current').text('看到：' + obj.curChapter).attr({
            href: baseChapter + obj.curUrl,
            target: '_blank'
        });
        $liInstance.find('.right .source').text(getSiteName(origin)).attr({
            href: origin,
            target: '_blank'
        });
        $liInstance.find('.right .delBtn').text('删除').attr('data-index', colIndex + ',' + index).on('click', delCollect);
        $liInstance.find('.right .contBtn').text('继续阅读').attr({
            href: baseChapter + obj.curUrl,
            target: '_blank'
        });
        //添加最新按钮
        if (obj.isUpdate) {
            $liInstance.find('.middle .news-badge').css('display', 'inline-block').attr({
                href: baseChapter + obj.newUrl,
                target: '_blank'
            });
        }
        log($liInstance);
        $comicList.append($liInstance);
    });
}
/**
 * 导出数据
 */
function exportHandler() {
    storLocal.get(['allFavs', 'updateNum'], function(resObj) {
        log('export obj', resObj);
        var blob = new Blob([JSON.stringify(resObj)], {
            type: 'text/plain;charset=utf-8'
        });
        saveAs(blob, 'ComicList.json');
    });
}
/**
 * 导入数据
 */
function importHandler() {
    $fileImport.get(0).click();
}
/**
 * 解析文件并导入数据
 */
function fileImportChangeHandler(e) {
    var files = this.files;
    if (files.length) {
        var file = files[0],
            reader = new FileReader(); //new一个FileReader实例
        reader.onload = function() {
            var data = JSON.parse(this.result);
            var allFavs = data.allFavs;
            storLocal.set(data);
            allFavs.forEach(resolveColItems);
            sendMsg(null,'updateNumChange');
        };
        reader.readAsText(file);
    }
}
/**
 * 删除收藏的漫画
 */
function delCollect(e) {
    //删除UI
    $(this).parents('li').remove();
    //从本地存储中删除
    var indexArr = $(this).data('index').split(',');
    getStoreLocal('allFavs',function(allFavs){
        var delArr = allFavs[indexArr[0]].cols.splice(indexArr[1], 1);
        decUpdateNum(delArr[0]);
        log('allFavs', allFavs);
        storLocal.set({
            allFavs: allFavs
        });
    });
    
}
/**
 * 根据站点url获得网站名称
 * @param  {string} site 站点url
 */
function getSiteName(site) {
    var name;
    if (site.indexOf('kuaikan') >= 0) {
        name = '快看漫画';
    } else if (site.indexOf('ac.qq') >= 0) {
        name = '腾讯动漫';
    }else if(site.indexOf('www.dmzj')>=0 || site.indexOf('manhua.dmzj')>=0){
        name = '动漫之家';
    }
    return name;
}