// Some basic calculation functions

export function numAddZero(num){

    num = String(num)
    return num.length < 2 ? '0' + num : num
}

export function getDateFromTs(ts, mode){
    var res
    const d = new Date(ts)
    if(mode == "date"){
        res = d.getFullYear() + '-' + numAddZero(d.getMonth() + 1) + '-' + numAddZero(d.getDate())
    } 

    else if(mode == "datesimple"){
        res = numAddZero(d.getMonth() + 1) + '-' + numAddZero(d.getDate())
    }

    else if(mode == "dateslim"){
        res = (d.getMonth() + 1) + '.' + d.getDate()
    }

    else if(mode == "time"){
        res = numAddZero(d.getHours()) + ':' + numAddZero(d.getMinutes()) + ':' + numAddZero(d.getSeconds())
    }

    else{
        res = d.getFullYear() + '-' + numAddZero(d.getMonth() + 1) + '-' + numAddZero(d.getDate()) + ' ' + numAddZero(d.getHours()) + ':' + numAddZero(d.getMinutes()) + ':' + numAddZero(d.getSeconds())
    }
    return res
}

export function indexOfObjArr(target, arr, id){
    var res = -1
    for(let i=0;i<arr.length;i++){
        if(target == arr[i][id]){
            res = i
        }
    }

    return res
}

export function stripSlashes (str){
    return str.replace(/\\(.)/mg, "$1");
}

export function lightCopy(obj){
    return Object.assign(obj)
}

export function deepCopy(obj){
    return JSON.parse(JSON.stringify(obj))
}

// Cal Geo Daistance, from one point to another
export function geoDistance( lat1,  lng1,  lat2,  lng2){
    var radLat1 = lat1 * Math.PI / 180.0
    var radLat2 = lat2 * Math.PI / 180.0
    var a = radLat1 - radLat2
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
    s = s * 6378.137 // EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000
    return s;
}

// Clean str
export function clean(s) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"); 
    var rs = ""; 
    for (var i = 0; i < s.length; i++) {
        rs = rs+s.substr(i, 1).replace(pattern, ''); 
    } 
    return rs;
}

// Remove all front and back space
export function removeFBSpace(str){ 
    return str.replace(/(^\s*)|(\s*$)/g, ""); 
}
