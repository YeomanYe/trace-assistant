import Constant from '../../constant';

const {SITE_BILIBILI,TYPE_VIDEO} = Constant;
const origin = 'https://www.bilibili.com';
const site = SITE_BILIBILI;
const baseIndex = origin + '/bangumi/media/';
const baseChapter = origin + '/bangumi/play/';
const baseImg = '//i0.hdslb.com/bfs/bangumi/';
const siteName = '哔哩哔哩';
const struct = [{regExp:/https?:\/\/ask.csdn.net\/questions\/[\d]+/,origin,type:TYPE_VIDEO,site,baseIndex,baseChapter,baseImg,siteName}];

export default struct;
