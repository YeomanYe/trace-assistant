
function getBaseUrl(url1,url2){
    var arr1 = url1.split('/'),
        arr2 = url2.split('/');
    var sameArr = [];
    for(var i=0,len=arr1.length;i<len;i++){
        if(arr1[i] === arr2[i]) sameArr.push(arr1[i]);
    }
    return sameArr.join('/');
}