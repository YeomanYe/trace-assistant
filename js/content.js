/*var img = new Image();
img.setAttribute('style','position:fixed;bottom:20px;width:80px;right:20px;z-index:999');
document.body.appendChild(img);*/
$(function(){
    var $img = $('<img>');
    $img.get(0).src = chrome.runtime.getURL('images/comic.png');
    $img.css({
        position:'fixed',
        bottom:'20px',
        right:'20px',
        width:'80px',
        'z-index':999
    });
    $('body').append($img);
})