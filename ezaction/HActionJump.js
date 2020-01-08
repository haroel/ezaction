/*
 * @CreateTime: Feb 7, 2018 5:44 PM
 * @Author: howe
 * @Contact: ihowe@outlook.com
 * @Last Modified By: howe
 * @Last Modified Time: Feb 7, 2018 6:49 PM
 * @Description: 
 * 
 * 类似cc.jumpBy 和cc.jumpTo
 * 
 */

let HActionJumpBy = cc.Class({
    extends: require("HActionInterval"),
    ctor: function () {
        this._delta = { x: 0, y: 0 };
        this._height = 0;
        this._jumps = 1;
        this._startPos = {};
    },
    init: function (duration, pos, height, jumps, vars/** null */) {
        this._super(duration, vars);
        this._delta.x = pos.x;
        this._delta.x = pos.y;
        this._height = height;
        this._jumps = jumps;
    },

    startWithTarget: function (component) {
        this._super(component);
        this._startPos.x = this.getNode().x;
        this._startPos.y = this.getNode().y;
    },
    update: function (rate) {
        this._super(rate);
        let vars = this._vars;
        let node = this.getNode();
        let dt = this.getProgress();

        let frac = rate * this._jumps % 1.0;
        let y = this._height * 4 * frac * (1 - frac);
        y += this._delta.y * rate;
        node.y = this._startPos.y + y;
        node.x = this._startPos.x + this._delta.x * dt;

    },
    /* cloneSelf  */
    cloneSelf: function () {
        let act = new HActionJumpBy();
        act.init(this.getDuration(),this._delta, this._height,this._jumps, this.getVars());
        act.easing(this.easingFunc);
        return act;
    }
});

let HActionJumpTo = cc.Class({
    extends: HActionJumpBy,
    ctor: function () {
        this._endPos = {x:0,y:0};
    },
    init: function (duration, pos, height, jumps, vars/** null */) {
        this._super( duration, pos, height, jumps, vars );
        this._endPos.x = pos.x;
        this._endPos.y = pos.y;
    },

    startWithTarget: function (component) {
        this._super(component);
        this._delta.x = this._endPos.x - this._startPos.x;
        this._delta.y = this._endPos.y - this._startPos.y;
    },
    /* cloneSelf  */
    cloneSelf: function () {
        let act = new HActionJumpTo();
        act.init(this.getDuration(), this._endPos, this._height,this._jumps, this.getVars());
        return act;
    }
});

module.exports = {
    jumpBy:HActionJumpBy,
    jumpTo:HActionJumpTo
};