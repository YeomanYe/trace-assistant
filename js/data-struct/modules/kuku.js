import Constant from '../../Constant';

const {SITE_KUKU,TYPE_COMIC} = Constant;
const origin = 'http://comic.kukudm.com';
const site = SITE_KUKU;
const baseIndex = origin + '/comiclist/';
const baseChapter = origin + '/comiclist/';
const baseImg = 'http://img.1whour.com/xpic/';
const siteName = 'Kuku动漫';
const struct = [{regExp:/kukudm.com\/comiclist/,origin,type:TYPE_COMIC,site,baseIndex,baseChapter,baseImg,siteName}];

export default struct;
