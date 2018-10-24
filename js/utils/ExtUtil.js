export const sendMsg = chrome.runtime.sendMessage;

export async function sendBg(datas) {
    return new Promise((resolve,reject) => {
        chrome.runtime.sendMessage(null,datas,function (data) {
            resolve(data);
        })
    });
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
