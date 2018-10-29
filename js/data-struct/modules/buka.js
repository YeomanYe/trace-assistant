import Constant from '../../Constant';

const {SITE_BUKA,TYPE_COMIC} = Constant;
const origin = 'http://www.buka.cn';
const site = SITE_BUKA;
const baseIndex = origin + '/detail/';
const baseChapter = origin + '/view/';
const baseImg = 'http://i-r7.ibuka.cn/logo/';
const siteName = '布卡漫画';
const struct = [{regExp:/(www.buka.cn\/detail)|(www.buka.cn\/view)/,origin,type:TYPE_COMIC,site,baseIndex,baseChapter,baseImg,siteName}];

export default struct;
