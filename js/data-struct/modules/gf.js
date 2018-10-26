import Constant from '../../Constant';

const {SITE_GF,TYPE_COMIC} = Constant;
const origin = 'http://www.gufengmh.com';
const site = SITE_GF;
const baseIndex = origin + '/manhua/';
const baseChapter = origin + '/manhua/';
const baseImg = 'http://res.gufengmh.com/images/cover/';
const siteName = '古风漫画';
const struct = [{regExp:/gufengmh.com\/manhua\/.+/,origin,type:TYPE_COMIC,site,baseIndex,baseChapter,baseImg,siteName}];

export default struct;
