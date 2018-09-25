/**
 * ihowe@outlook.com
 * author by haroel
 * Created by howe on 2017/3/22.
 */
let HActionTweenBy = cc.Class({
    extends: require("HActionTweenBase"),
    ctor: function () {
    },
    update: function (rate) {
        this._super(rate);
        let vars = this._vars;
        let node = this.getTarget();
        let progress = this.getProgress();
        let pList = this._intialAttrList;
        for (let key in pList) {
            let _o = pList[key];
            node[key] = _o + vars[key] * progress;
        }
    },
    /* cloneSelf 不复制方法 */
    cloneSelf: function () {
        let act = new HActionTweenBy();
        act.init(this.getDuration(), this.getVars());
        act.easing(this.easingFunc);
        return act;
    }
});

HActionTweenBy.create = function (duration, vars) {
    let tween = new HActionTweenBy();
    tween.init(duration, vars);
    return tween;
};

module.exports = HActionTweenBy;