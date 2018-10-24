export const sendMsg = chrome.runtime.sendMessage;

export function formatHref(href, baseHref) {
    let retHref;
    let index = href.search('^https?://');
    if (index < 0) {
        //如果href不是http打头，那么应该为 //www.xx.com/dd 这样的形式
        if (!baseHref) retHref = 'http:' + href;
        else {
            href = baseHref + href;
            index = href.search('^https?://');
            if (index < 0) retHref = 'http:' + href;
            else retHref = href;
        }
    } else {
        retHref = href;
    }
    return retHref;
}

/**
 * 发送通知到全部的tab页
 * @param data
 */
export function sendToAllTabs(data) {
    chrome.windows.getAll(null, function (wins) {
        for (let i = 0, len = wins.length; i < len; i++) {
            let win = wins[i];
            chrome.tabs.query({windowId: win.id}, function (tabs) {
                for (let i = 0, len = tabs.length; i < len; i++) {
                    let tab = tabs[i];
                    chrome.tabs.sendMessage(tab.id, data);
                }
            });
        }
    });
}


/**
 * 发送通知到当前tab页
 * @param data
 * @param handler
 */
export function sendToCurTab(data, handler) {
    chrome.tabs.query({active: true}, function (tabs) {
        let tab = tabs[0];
        handler = handler || function () {
        };
        chrome.tabs.sendMessage(tab.id, data, null, handler);
    });
}
