
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

 function bezierAt (a, b, c, d, t) {
    return (Math.pow(1 - t, 3) * a +
        3 * t * (Math.pow(1 - t, 2)) * b +
        3 * Math.pow(t, 2) * (1 - t) * c +
        Math.pow(t, 3) * d );
};

let HActionBezierBy = cc.Class({
    extends: require("HActionInterval"),
    ctor: function () {
        this._config = [];
        this._startPosition = cc.v2(0, 0);
        this._previousPosition = cc.v2(0, 0);
    },

    init: function (duration, vec2s, lets/** null */) {
        this._super(duration, lets);
        this._config = vec2s;
    },

    startWithTarget: function (component) {
        this._super(component);
        let locPosX = this.target.x;
        let locPosY = this.target.y;
        this._previousPosition.x = locPosX;
        this._previousPosition.y = locPosY;
        this._startPosition.x = locPosX;
        this._startPosition.y = locPosY;

    },
    update: function (rate) {
        this._super(rate);
        let progress = this.getProgress();

        let locConfig = this._config;
        let xa = 0;
        let xb = locConfig[0].x;
        let xc = locConfig[1].x;
        let xd = locConfig[2].x;

        let ya = 0;
        let yb = locConfig[0].y;
        let yc = locConfig[1].y;
        let yd = locConfig[2].y;

        let x = bezierAt(xa, xb, xc, xd, progress);
        let y = bezierAt(ya, yb, yc, yd, progress);

        let locStartPosition = this._startPosition;
        if (cc.macro.ENABLE_STACKABLE_ACTIONS) {
            let targetX = this.target.x;
            let targetY = this.target.y;
            let locPreviousPosition = this._previousPosition;

            locStartPosition.x = locStartPosition.x + targetX - locPreviousPosition.x;
            locStartPosition.y = locStartPosition.y + targetY - locPreviousPosition.y;
            x = x + locStartPosition.x;
            y = y + locStartPosition.y;
            locPreviousPosition.x = x;
            locPreviousPosition.y = y;
            this.target.setPosition(x, y);
        } else {
            this.target.setPosition(locStartPosition.x + x, locStartPosition.y + y);
        }

    },
    /* cloneSelf  */
    cloneSelf: function () {
        let act = new HActionBezierBy();
        act.init(this.getDuration(),this._config, this.getlets());
        act.easing(this.easingFunc);
        return act;
    }
});

let HActionBezierTo = cc.Class({
    extends: HActionBezierBy,
    ctor: function () {
        this._toConfig = [];
    },
    init: function (duration, vec2s, lets/** null */) {
        this._super( duration, vec2s, lets );
        this._toConfig = vec2s;
    },

    startWithTarget: function (component) {
        this._super(component);
        let locStartPos = this._startPosition;
        let locToConfig = this._toConfig;
        let locConfig = this._config;

        locConfig[0] = locToConfig[0].sub(locStartPos);
        locConfig[1] = locToConfig[1].sub(locStartPos);
        locConfig[2] = locToConfig[2].sub(locStartPos);
    },
    /* cloneSelf  */
    cloneSelf: function () {
        let act = new HActionBezierTo();
        act.init(this.getDuration(), this._toConfig, this.getlets());
        return act;
    }
});

module.exports = {
    bezierBy:HActionBezierBy,
    bezierTo:HActionBezierTo
};