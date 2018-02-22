var storSync = chrome.storage.sync;
storSync.get('kukuCol',function(array){
    console.log(array);
});