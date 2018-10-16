const Constant = {
    TYPE_COMIC: 'comic',//漫画
    TYPE_VIDEO: 'video',//视频
    TYPE_FICTION: 'fiction',//小说

    BG_CMD_EXPORT: 'exportCollect', //background页 执行的命令
    BG_CMD_UPDATE_NUM: 'updateNumChange',
    BG_CMD_UPDATE_FAV_BTN: 'updateFavBtn', //更新content页的favbtn图标

    CNT_CMD_UPDATE_CUR_FAV: 'updateCurFav',//content页 命令
    CNT_CMD_EXOPORT_FAV: 'exportFav',//导出文件命令

    STATUS_UNAUTH: 403, //未授权的
    STATUS_OK: 200, //导出收藏成功
    STATUS_EXPORT_FAIL: 100,//导出失败

    STOR_KEY_FAVS: 'allFavs',
    STOR_KEY_UPDATE_NUM: 'updateNum',
    STOR_KEY_IS_CLOSE_TIPS: 'isCloseTips',
    SERVICE_UTIL: 'http://140.143.157.181:3000',

    SITE_QIDIAN: 'qidian', //起点
    SITE_QQ: 'ac.qq',
    SITE_W3_DMZJ: 'www.dmzj',
    SITE_MH_DMZJ: 'manhua.dmzj',
    SITE_DMZJ: 'dmzj',
    SITE_KUAIKAN: 'kuaikan',
    SITE_BILIBILI: 'bilibili',
    SITE_KUKU: 'kuku',
    SITE_CARTOONMAD: 'cartoonmad',
    SITE_GF: 'gufengmh',
    SITE_BUKA: 'buka',

    EVT_BATCH_DEL: 'batchDel',
    EVT_BATCH_MARK_READ: 'batchMarkRead',

    TIME_SHORT: 1000,
    TIME_LONG: 5 * 1000,

    CUR_FAV: { //用于popup中显示当前的状态类型
        ALL: 0,
        COMIC: 1,
        FICTION: 2,
        VIDEO: 3
    },
    CUR_NAV:{ //用于popup中表示当前显示的面板
        FAV:0,
        SETTING:1
    }
};
export default Constant;
