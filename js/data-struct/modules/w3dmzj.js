import Constant from '../../Constant';

const {SITE_W3_DMZJ,TYPE_COMIC} = Constant;
const origin = 'https://www.dmzj.com';
const site = SITE_W3_DMZJ;
const baseIndex = origin + '/info/';
const baseChapter = origin + '/view/';
const baseImg = 'https://images.dmzj.com/img/webpic/';
const siteName = '动漫之家';
const struct = [{regExp:/(dmzj.com\/info)|(dmzj.com\/view)/,origin,type:TYPE_COMIC,site,baseIndex,baseChapter,baseImg,siteName}];

export default struct;
