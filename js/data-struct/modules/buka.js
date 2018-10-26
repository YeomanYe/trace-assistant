import Constant from '../../Constant';

const {SITE_GF,TYPE_COMIC} = Constant;
const origin = 'http://www.buka.cn';
const site = SITE_GF;
const baseIndex = origin + '/detail/';
const baseChapter = origin + '/view/';
const baseImg = 'http://i-r7.ibuka.cn/logo/';
const siteName = '布卡漫画';
const struct = [{regExp:/(www.buka.cn\/detail)|(www.buka.cn\/view)/,origin,type:TYPE_COMIC,site,baseIndex,baseChapter,baseImg,siteName}];

export default struct;
