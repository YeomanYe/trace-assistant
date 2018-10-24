import Constant from '../../constant';

const {SITE_KUAIKAN,TYPE_COMIC} = Constant;
const origin = 'http://www.kuaikanmanhua.com';
const site = SITE_KUAIKAN;
const baseIndex = origin + '/web/topic';
const baseChapter = origin + '/web/comic/';
const baseImg = 'https://i1s.kkmh.com/image';
const siteName = '快看漫画';
const struct = [{regExp:/https?:\/\/ask.csdn.net\/questions\/[\d]+/,origin,type:TYPE_COMIC,site,baseIndex,baseChapter,baseImg,siteName}];

export default struct;
