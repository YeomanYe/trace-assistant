var _allBaseStoreObj = {};
function getBaseStoreObj(name,type){
    var keys = Object.keys(_allBaseStoreObj);
    var origin;
    //说明name是origin
    if(name.search('http')>=0){
        origin = name;
    }
    var index = arrInStr(keys,name);
    type = type ? type : TYPE_COMIC;
    if(index >= 0)
        return _allBaseStoreObj[keys[index]](origin,type);
}

_allBaseStoreObj['kuaikan'] = function(origin,type){
        origin = origin ? origin : 'http://www.kuaikanmanhua.com';
    var baseImgUrl = 'https://i1s.kkmh.com/image',
        baseChapterUrl = origin + '/web/comic/',
        baseIndexUrl = origin + '/web/topic';
    var storObj = {
        baseImg: baseImgUrl,
        baseIndex: baseIndexUrl,
        baseChapter: baseChapterUrl,
        origin: origin,
        type:type,
        site: 'kuaikan',
        siteName:'快看漫画'
    };
    return storObj;
}

_allBaseStoreObj['ac.qq'] = function(origin,type){
    origin = origin ? origin : 'http://ac.qq.com';
    var baseImgUrl = 'https://manhua.qpic.cn/vertical/',
        baseChapterUrl = origin + '/ComicView/index/id/',
        baseIndexUrl = origin + '/Comic/comicInfo/id/';

    var storObj = {
        baseImg: baseImgUrl,
        baseIndex: baseIndexUrl,
        baseChapter: baseChapterUrl,
        type:type,
        origin: origin,
        site: 'ac.qq',
        siteName:'腾讯动漫'
    };
    return storObj;
}

_allBaseStoreObj['www.dmzj'] = function(origin,type){
        origin = origin ? origin : 'https://www.dmzj.com';
    var baseImgUrl = 'https://images.dmzj.com/img/webpic/',
        baseChapterUrl = origin + '/view/',
        baseIndexUrl = origin + '/info/';

    var storObj = {
        baseImg: baseImgUrl,
        baseIndex: baseIndexUrl,
        baseChapter: baseChapterUrl,
        type:type,
        origin: origin,
        site: 'www.dmzj',
        siteName:'动漫之家'
    };
    return storObj;
}

_allBaseStoreObj['manhua.dmzj'] = function(origin,type){
    type = type ? type : TYPE_COMIC;
    origin = origin ? origin : 'https://manhua.dmzj.com';
    var baseImgUrl = 'https://images.dmzj.com/webpic/',
        baseChapterUrl = origin,
        baseIndexUrl = origin;

    storObj = {
        baseImg: baseImgUrl,
        baseIndex: baseIndexUrl,
        baseChapter: baseChapterUrl,
        type:type,
        origin: origin,
        site: 'manhua.dmzj',
        siteName:'动漫之家'
    };
    return storObj;
}
