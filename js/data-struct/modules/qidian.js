import Constant from '../../Constant';

const {SITE_QIDIAN,TYPE_FICTION} = Constant;
const origin = 'https://www.qidian.com';
const site = SITE_QIDIAN;
const baseIndex = 'https://book.qidian.com/info/';
const baseChapter = 'https://read.qidian.com/chapter/';
const baseImg = '//bookcover.yuewen.com/qdbimg/';
const siteName = '起点';
const struct = [{regExp:/((book.qidian.com\/info\/.+)|(vipreader.qidian.com\/chapter\/.+)|(read.qidian.com\/chapter\/.+))/,origin,type:TYPE_FICTION,site,baseIndex,baseChapter,baseImg,siteName}];

export default struct;
