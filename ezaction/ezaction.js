/**
 * ihowe@outlook.com
 * author by haroel
 * Created by howe on 2017/3/23.
 */

let ezaction = ezaction || {};
module.exports = ezaction;
if (window && typeof window === 'object') {
    window.ezaction = ezaction;
}
//0 表示初始化,1表示运行,2表示暂停,3表示停止,4表示销毁
ezaction.State = {
    INITIAL: 0,
    RUNNING: 1,
    PAUSED: 2,
    STOPPED: 3,
    DEAD: 4
};

ezaction.HVars = require("HVars");
ezaction.ease = require("HEaseDefine");

ezaction.HAction = require("HAction");
ezaction.HActionInstant = require("HActionInstant");
ezaction.HActionInterval = require("HActionInterval");
ezaction.HActionTween = require("HActionTween");
ezaction.HActionTweenBy = require("HActionTweenBy");
ezaction.HActionSpawn = require("HActionSpawn");
ezaction.HActionSequence = require("HActionSequence");

ezaction.HActionJumpBy = require("HActionJump").jumpBy;
ezaction.HActionJumpTo = require("HActionJump").jumpTo;

let __checkParams = function (params) {
    // 剔除参数当中的不需要数据
    let obj = {};
    for (let k in params) {
        let _o = params[k];
        if (typeof _o === "number") {
            obj[k] = _o;
        }
    }
    return obj;
};

ezaction.v2 = function (_x, _y) {
    if (typeof _x === 'number') {
        return { x: _x, y: _y };
    }
    return { x: _x.x, y: _x.y };
};

ezaction.callFuncWithParam = function (func, ...aArgs) {
    let vars = {};
    vars["onComplete"] = function () {
        func(...aArgs);
    };
    return ezaction.HActionInstant.create(vars);
};

ezaction.callFunc = function (func, params/* null */, vars/* null */) {
    vars = vars || {};
    vars["onComplete"] = function () {
        func(params);
    };
    return ezaction.HActionInstant.create(vars);
};

ezaction.delay = function (duration, vars/* null */) {
    return ezaction.HActionInterval.create(duration, vars);
};
ezaction.delayTime = ezaction.delay;

ezaction.sequence = function (actions, vars/* null */) {
    return ezaction.HActionSequence.create(actions, vars);
};

ezaction.spawn = function (actions, vars/* null */) {
    return ezaction.HActionSpawn.create(actions, vars);
};

ezaction.tween = function (duration, params, vars) {
    params = __checkParams(params);
    let _vars = vars;
    if (!_vars) {
        _vars = params || {};
    } else {
        for (let k in params) {
            _vars[k] = params[k]
        }
    }
    let tween = ezaction.HActionTween.create(duration, _vars);
    return tween;
};

ezaction.tweenBy = function (duration, params, vars) {
    params = __checkParams(params);
    let _vars = vars;
    if (!_vars) {
        _vars = params || {};
    } else {
        for (let k in params) {
            _vars[k] = params[k]
        }
    }
    let tween = ezaction.HActionTweenBy.create(duration, _vars);
    return tween;
};

ezaction.moveTo = ezaction.tween;

ezaction.moveBy = ezaction.tweenBy;

ezaction.scaleTo = ezaction.tween;

ezaction.scaleBy = ezaction.tweenBy;

ezaction.skewTo = ezaction.tween;

ezaction.skewBy = ezaction.tweenBy;

ezaction.rotateBy = function (duration, numberOrObj, vars) {
    let params = null;
    if (typeof numberOrObj === "number") {
        params = {};
        params.rotationX = numberOrObj;
        params.rotationY = numberOrObj;
    } else {
        params = numberOrObj;
    }
    return ezaction.tweenBy(duration, params, vars);
};
ezaction.rotateTo = function (duration, numberOrObj, vars/* null */) {
    let params = null;
    if (typeof numberOrObj === "number") {
        params = {};
        params.rotationX = numberOrObj;
        params.rotationY = numberOrObj;
    } else {
        params = numberOrObj;
    }
    return ezaction.tween(duration, params, vars);
};

ezaction.fadeTo = function (duration, opacity, vars/* null */) {
    let params = {};
    params.opacity = opacity;
    return ezaction.tween(duration, params, vars);
};

ezaction.fadeIn = function (duration, vars/* null */) {
    return ezaction.fadeTo(duration, 255, vars)
};

ezaction.fadeOut = function (duration, vars/* null */) {
    return ezaction.fadeTo(duration, 0, vars)
};

ezaction.show = function (vars/* null */) {
    vars = vars || {};
    let m = new ezaction.HActionInstant();
    vars.onComplete = function (action) {
        action.getNode()._sgNode.setVisible(true);
    };
    m.init(vars);
    return m;
};

ezaction.hide = function (vars/* null */) {
    vars = vars || {};
    let m = new ezaction.HActionInstant();
    vars.onComplete = function (action) {
        action.getNode()._sgNode.setVisible(false);
    };
    m.init(vars);
    return m;
};

ezaction.jumpBy = function (duration, pos, height, jumps, vars/* null */){

    let act = new ezaction.HActionJumpBy();
    act.init( duration , pos , height , jumps , vars );
    return act;
}

ezaction.jumpTo = function (duration, pos, height, jumps, vars/* null */){
    let act = new ezaction.HActionJumpTo();
    act.init( duration , pos , height , jumps , vars );
    return act;
}