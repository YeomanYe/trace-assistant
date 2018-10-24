import Constant from '../../constant';

const {SITE_MH_DMZJ,TYPE_COMIC} = Constant;
const origin = 'https://manhua.dmzj.com';
const site = SITE_MH_DMZJ;
const baseIndex = origin;
const baseChapter = origin;
const baseImg = 'https://images.dmzj.com/webpic/';
const siteName = '动漫之家';
const struct = [{regExp:/https?:\/\/ask.csdn.net\/questions\/[\d]+/,origin,type:TYPE_COMIC,site,baseIndex,baseChapter,baseImg,siteName}];

export default struct;
