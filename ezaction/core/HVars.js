/**
 * ihowe@outlook.com
 * author by haroel
 * Created by howe on 2017/3/29.
 */
let HVars = function () {
    this.tag = 0;
    this.speed = 1;
    this.repeat = 0;
    this.delay = 0;
};

HVars.prototype.clone = function (obj) {
    let result = obj || {};
    let arr = Object.keys(this);
    for (let i = 0; i < arr.length; i++) {
        let key = arr[i];
        let _type = typeof this[key];
        if (this[key] instanceof Array) {
            result[key] = [];
            for (let j = 0; j < this[key].length; j++) {
                result[key][j] = this[key][j];
            }
        } else {
            result[key] = this[key];
        }
    }
    return result;
};

/*参数patch*/
HVars.prototype.patchParams = function (params) {
    if (!params) {
        return;
    }
    if (params instanceof HVars) {
        params.clone(this);
        return;
    }
    for (let key in params) {
        this[key] = params[key];
    }
};

module.exports = HVars;

