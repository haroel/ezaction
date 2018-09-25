/**
 * ihowe@outlook.com
 * author by haroel
 * Created by howe on 2017/3/30.
 *
 * 瞬时Action基类
 */
let Instant = cc.Class({
    extends: require("HAction"),
    ctor: function () { },
    update: function (rate) {
        this.$actionComplete();
    },
    cloneSelf: function () {
        let act = new Instant();
        act.init(this.getVars());
        return act;
    }
});
Instant.create = function (vars) {
    let mm = new Instant();
    mm.init(vars);
    return mm;
};
module.exports = Instant;
