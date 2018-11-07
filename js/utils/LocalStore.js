const Promise = require('bluebird');
let storLocal = chrome.storage.local;
let cache = {};
export default class LocalStore{
    static save(key,val){
        return new Promise((resolve,reject) => {
            let storObj;
            if(typeof key === 'string'){
                storObj = {[key]:val};
            } else{
                storObj = key;
            }
            cache = {
                ...cache,
                ...storObj
            };
            storLocal.set(storObj,()=>{
                resolve();
            });
        });
    }
    static load(keys,unCache) {
        return new Promise((resolve,reject) => {
            //如果存在缓存，说明保存过可以直接使用
            let flag = true;
            let ret;
            if(!unCache){
                if(typeof keys === 'string'){
                    if(cache[keys] === undefined){
                        flag = false;
                    }else ret = cache[keys];
                } else {
                    ret = keys.map(key => {
                        if(cache[key] === undefined) flag = false;
                        return cache[key];
                    });
                }
                if(flag) return resolve(ret);
            }

            //缓存不存在时，从本地存储查找
            storLocal.get(keys,(resObj) => {
                if(typeof keys === 'string'){
                    ret = resObj[keys];
                    cache[keys] = ret;
                } else {
                    ret = keys.map(key => {
                        cache[key] = resObj[key];
                    });
                }
                resolve(ret);
            });
        });
    }
}
