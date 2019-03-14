function format(format) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return format;
};


function marketJudgment(code) {
    if (code !== undefined) {
        var topThree = code.slice(0, 3);
        switch (topThree) {
            case '110':
            case '120':
            case '129':
            case '100':
            case '201':
            case '310':
            case '500':
            case '550':
            case '600':
            case '700':
            case '710':
            case '701':
            case '720':
            case '730':
            case '735':
            case '737':
            case '900':
            case '601':
            case '603':
                return '1';
        }
        return '2'
    }
}




export {format,marketJudgment}