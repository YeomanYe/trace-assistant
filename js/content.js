/*var img = new Image();
img.src = chrome.runtime.getURL("images/comic.png");
img.setAttribute('style','position:absolute;bottom:20px;right:20px;z-index:999');
document.body.appendChild(img);*/
var div = document.createElement('div');
div.className = 'comic';
div.setAttribute('style','position:absolute;bottom:20px;right:20px;z-index:999;width:30px;height:30px');
document.body.appendChild(div);