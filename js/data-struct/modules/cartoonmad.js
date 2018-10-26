import Constant from '../../Constant';

const {SITE_CARTOONMAD,TYPE_COMIC} = Constant;
const origin = 'http://www.cartoonmad.com';
const site = SITE_CARTOONMAD;
const baseIndex = origin + '/cartoonmad/';
const baseChapter = origin + '/cartoonmad/';
const baseImg = 'http://img.cartoonmad.com/ctimg/';
const siteName = '動漫狂';
const struct = [{regExp:/cartoonmad.com\/comic/,origin,type:TYPE_COMIC,site,baseIndex,baseChapter,baseImg,siteName}];

export default struct;
