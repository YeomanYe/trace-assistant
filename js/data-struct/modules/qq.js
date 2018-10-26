import Constant from '../../Constant';

const {SITE_QQ,TYPE_COMIC} = Constant;
const origin = 'http://ac.qq.com';
const site = SITE_QQ;
const baseIndex = origin + '/Comic/ComicInfo/id/';
const baseChapter = origin + '/ComicView/index/id/';
const baseImg = 'https://manhua.qpic.cn/vertical/';
const siteName = '腾讯动漫';
const struct = [{regExp:/ac.qq.com\/Comic/,origin,type:TYPE_COMIC,site,baseIndex,baseChapter,baseImg,siteName}];

export default struct;
