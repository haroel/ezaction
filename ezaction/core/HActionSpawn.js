/**
 * ihowe@outlook.com
 * author by haroel
 * Created by howe on 2017/3/22.
 *
 * 同步执行
 */
let HActionSpawn = cc.Class({
    extends: require("HAction"),
    ctor: function () {
        this._actions = [];
    },
    setSpeed: function (value) {
        value = Math.abs(value);
        for (let i = 0; i < this._actions.length; i++) {
            this._actions[i].setSpeed(value);
        }
        return this._super(value);
    },
    pushAction: function (actions, isInhertSpeed) {
        for (let i = 0; i < actions.length; i++) {
            let act = actions[i];
            if (isInhertSpeed) {
                act.setSpeed(this.getSpeed());
            }
            this._actions.push(act);
        }
    },
    playAction: function () {
        this._super();
        // 重置所有Action的状态
        let len = this._actions.length;
        for (let i = 0; i < len; i++) {
            let act = this._actions[i];
            while (act) {
                act.playAction();
                act = act.$getNextAction();
            }
        }
    },
    $update: function (dt) {
        this._super(dt);
        if (!this._actions) {
            this.$actionComplete();
            return;
        }
        let flag = true;
        let len = this._actions.length;
        for (let i = 0; i < len; i++) {
            let act = this._actions[i];
            while (act) {
                if (!act.getNode()) {
                    act.startWithTarget(this._actionComponent);
                }
                if (act.isRunning()) {
                    act["_$update"](dt);
                    flag = false;
                    break;
                }
                act = act.$getNextAction();
            }
        }
        if (flag) {
            this.$actionComplete();
        }
    },
    cloneSelf: function () {
        let spawn = new HActionSpawn();
        spawn.init(this.getVars());
        if (this._actions) {
            let list = [];
            this._actions.forEach(function (action) {
                list.push(action);
            });
            spawn.pushAction(list, false);
            list = null;
        }
        return spawn;
    },
    $invalid: function () {
        if (!this._actions) {
            // cc.warn(" HActionSpawn 重复调用$invalid ");
            this._super();
            return;
        }
        this._actions.forEach(function (action) {
            action.destroy();
        });
        this._actions = null;
        this._super();
    },
    $destroy: function () {
        this._actions = null;
        this._super();
    }
});

HActionSpawn.create = function (actions, vars /* null */) {
    let act = new HActionSpawn();
    act.init(vars);
    act.pushAction(actions);
    return act;
};
module.exports = HActionSpawn;