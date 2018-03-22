var $optionTab, $colTab, $favList, $settingList, $export, $import, $fileImport;
var $allFav,$comicFav,$fictionFav,$videoFav;
var $contentFav,$contentSetting;
var favBtnGroups = [];
$(function () {
    init();
});

function init() {
    $optionTab = $('#optionTab').on('click', optionTabHandler);
    $colTab = $('#colTab').on('click', colTabHandler);
    $export = $('#export').on('click', exportHandler);
    $import = $('#import').on('click', importHandler);
    $allFav = $('#allFav').on('click',createFavBtnHandler());
    $comicFav = $('#comicFav').on('click',createFavBtnHandler(TYPE_COMIC));
    $fictionFav = $('#fictionFav').on('click',createFavBtnHandler(TYPE_FICTION));
    $videoFav = $('#videoFav').on('click',createFavBtnHandler(TYPE_VIDEO));
    $contentFav = $('#contentFavWrap');
    $contentSetting = $('#contentSettingWrap');
    favBtnGroups.push($allFav,$comicFav,$fictionFav,$videoFav);

    $fileImport = $('#fileImport').change(fileImportChangeHandler);
    $favList = $('#favList');
    $contentSetting.hide();
    $settingList = $('#settingList');
    getStoreLocal('allFavs', function (allFavs) {
        allFavs = allFavs ? allFavs : [];
        log(allFavs);
        allFavs.forEach(resolveColItems());
    });
}
function createFavBtnHandler(type) {
    return function (e) {
        var self = this;
        getStoreLocal('allFavs', function (allFavs) {
            for(var i=0,len=favBtnGroups.length;i<len;i++){
                favBtnGroups[i].removeClass('curFav');
            }
            $(self).addClass('curFav');
            $favList.empty();
            allFavs = allFavs ? allFavs : [];
            allFavs.forEach(resolveColItems(type));
        });
    }
}
/**
 * 点击收藏tab事件
 */
function colTabHandler() {
    $contentFav.show();
    $contentSetting.hide();
    $colTab.addClass('curTab');
    $optionTab.removeClass('curTab');
}

/**
 * 点击设置tab事件
 */
function optionTabHandler() {
    $contentFav.hide();
    $contentSetting.show();
    $optionTab.addClass('curTab');
    $colTab.removeClass('curTab');
}

/**
 * 处理每一个网站收藏的漫画
 */
function resolveColItems(type) {
    return function (colItem, colIndex) {
        var baseImg = colItem.baseImg,
            baseIndex = colItem.baseIndex,
            baseChapter = colItem.baseChapter,
            origin = colItem.origin,
            siteName = colItem.siteName,
            cols = colItem.cols,
            colType = colItem.type;
        if(type && type !== colType) return;
        log(baseImg, baseIndex);
        cols.forEach(function (obj, index) {
            liTempStr = $('#listItemTemplate').html();
            $liInstance = $(liTempStr);
            $liInstance.find('.left div').css({
                'background-image': 'url(' + formatHref(obj.imgUrl,baseImg) + ')',
                'background-size': 'cover',
                'background-repeat': 'no-repeat'
            });
            $liInstance.find('.left').attr({
                href: formatHref(obj.indexUrl, baseIndex),
                target: '_blank'
            });
            $liInstance.find('.middle h3 .titleName').text(obj.title).attr({
                href: formatHref(obj.indexUrl, baseIndex),
                target: '_blank'
            });
            $liInstance.find('.middle .news').text('最新：' + obj.newChapter).attr({
                href: formatHref(obj.newUrl, baseChapter),
                target: '_blank'
            });
            $liInstance.find('.middle .current').text('看到：' + obj.curChapter).attr({
                href: formatHref(obj.curUrl, baseChapter),
                target: '_blank'
            });
            $liInstance.find('.right .source').text(siteName).attr({
                href: formatHref(origin),
                target: '_blank'
            });
            $liInstance.find('.right .delBtn').text('删除').attr('data-index', colIndex + ',' + index).on('click', delCollect);
            var tmpText = '继续阅读';
            if(colType === TYPE_VIDEO) tmpText = '继续观看';
            $liInstance.find('.right .contBtn').text(tmpText).attr({
                href: formatHref(obj.curUrl, baseChapter),
                target: '_blank'
            });
            //添加最新按钮
            if (obj.isUpdate) {
                $liInstance.find('.middle .news-badge').css('display', 'inline-block').attr({
                    href: formatHref(obj.newUrl, baseChapter),
                    target: '_blank'
                });
            }
            log($liInstance);
            $favList.append($liInstance);
        });
    }

}

/**
 * 导出数据
 */
function exportHandler() {
    storLocal.get(['allFavs', 'updateNum'], function (resObj) {
        log('export obj', resObj);
        var blob = new Blob([JSON.stringify(resObj)], {
            type: 'text/plain;charset=utf-8'
        });
        saveAs(blob, '追综饭.json');
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
        reader.onload = function () {
            var data = JSON.parse(this.result);
            var allFavs = data.allFavs;
            //兼容老版本
            for(var i=0,len=allFavs.length;i<len;i++){
                var favItem = allFavs[i];
                favItem.type = favItem.type ? favItem.type : TYPE_COMIC;
            }
            storLocal.set(data,function () {
                sendMsg(null, [BG_CMD_UPDATE_NUM]);
            });
            // allFavs.forEach(resolveColItems());
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
    getStoreLocal('allFavs', function (allFavs) {
        var delArr = allFavs[indexArr[0]].cols.splice(indexArr[1], 1);
        decUpdateNum(delArr[0]);
        log('allFavs', allFavs);
        storLocal.set({
            allFavs: allFavs
        });
    });
}