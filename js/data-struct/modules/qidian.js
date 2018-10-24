import Constant from '../../constant';

const {SITE_QIDIAN,TYPE_FICTION} = Constant;
const origin = 'https://www.qidian.com';
const site = SITE_QIDIAN;
const baseIndex = 'https://book.qidian.com/info/';
const baseChapter = 'https://read.qidian.com/chapter/';
const baseImg = '//qidian.qpic.cn/qdbimg/';
const siteName = '起点';
const struct = [{regExp:/https?:\/\/ask.csdn.net\/questions\/[\d]+/,origin,type:TYPE_FICTION,site,baseIndex,baseChapter,baseImg,siteName}];

export default struct;
