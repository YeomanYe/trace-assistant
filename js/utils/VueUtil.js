export function mapModel(nameObjs) {
    return nameObjs.reduce((total, nameObj)=>{
        let curObj = nameObj.names.reduce((computed,name)=>({
            ...computed,
            [name]: {
                get (){
                    return this.$store.state[nameObj.ns][name];
                },
                set (value) {
                    this.$store.commit('set' + titleCase(name), value);
                }
            }
        }),{});
        return {...total,...curObj};
    }, {});
}

/**
 * 将一句话中的每个单词的首字母进行大小写转换
 * @param {string} str
 * @returns {any}
 */
export function titleCase(str) {
    let array = str.split(' ');
    for (let i = 0; i < array.length; i++){
        array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
    }
    let retStr = array.join(' ');

    return retStr;
}
