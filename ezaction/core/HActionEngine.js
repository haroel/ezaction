/*
 * @CreateTime: Feb 3, 2018 3:15 PM
 * @Author: howe
 * @Contact: ihowe@outlook.com
 * @Last Modified By: howe
 * @Last Modified Time: Mar 29, 2018 12:06 PM
 * @Description: EZAction 的驱动引擎 
 */
const HAction = require("HAction");
const HActionComponent = require("HActionComponent");

let HActionEngine = cc.Class({
    ctor: function () {
        this.uuid = "HActionEngine";
        this._id = this.uuid;
        this._actions = [];
        this._tempInvalidIds = {};

        let scheduler = cc.director.getScheduler();
        // scheduler.scheduleUpdateForTarget(this, 0, false);
        scheduler.scheduleUpdate(this, 0, false);
    },

    pushActionToQueue: function (hAction) {
        if (!(hAction instanceof HAction)) {
            cc.error("HActionEngine -> pushActionToQueue error: params must be a subclass of HAction!");
        }
        this._actions.push(hAction);
    },

    getActionByTag: function (hactionComponent, tag) {
        if (!(hactionComponent instanceof HActionComponent)) {
            cc.error("HActionEngine -> getActionByTag error: params must be a instance of HActionComponent!");
        }
        let len = this._actions.length;
        for (let i = 0; i < len; i++) {
            let _action = this._actions[i];
            if (_action.getComponent().uuid === hactionComponent.uuid) {
                if (_action.getTag() === tag) {
                    return _action;
                } else {
                    let preAction = _action;
                    let nextAction = _action.$getNextAction();
                    while (nextAction) {
                        if (nextAction.getTag() === tag) {
                            return nextAction;
                        }
                        preAction = nextAction;
                        nextAction = nextAction.$getNextAction();
                    }
                }
            }
        }
        return null;
    },

    getRunningActions: function (hactionComponent) {
        if (!(hactionComponent instanceof HActionComponent)) {
            cc.error("HActionEngine -> getRunningActions error: params must be a instance of HActionComponent!");
        }
        let ret = [];
        let len = this._actions.length;
        for (let i = 0; i < len; i++) {
            let _action = this._actions[i];
            if (_action.getComponent().uuid === hactionComponent.uuid) {
                if (_action.getState() === ezaction.State.RUNNING) {
                    ret.push(_action);
                }
            }
        }
        return ret;
    },

    removeAction: function (hAction) {
        if (!(hAction instanceof HAction)) {
            cc.error("HActionEngine -> removeAction error: params must be a subclass of HAction!");
        }
        if (hAction.getState() === ezaction.State.DEAD){
            return;
        }
        let uuid = hAction["$uuid"];
        let len = this._actions.length;
        for (let i = 0; i < len; i++) {
            let _action = this._actions[i];
            if (_action["$uuid"] === uuid) {
                this.__invalidActionAndNext(_action);
                return true;
            } else {
                let preAction = _action;
                let nextAction = _action.$getNextAction();
                while (nextAction) {
                    if (nextAction["$uuid"] === uuid) {
                        preAction.$removeNextAction();
                        return true;
                    }
                    preAction = nextAction;
                    nextAction = nextAction.$getNextAction();
                }
            }
        }
        return false;
    },

    removeAllActions: function (hactionComponent) {
        if (!(hactionComponent instanceof HActionComponent)) {
            cc.error("HActionEngine -> removeAllActions error: params must be a instance of HActionComponent!");
        }
        let len = this._actions.length;
        for (let i = 0; i < len; i++) {
            let _action = this._actions[i];
            if (_action.getComponent().uuid === hactionComponent.uuid) {
                this.__invalidActionAndNext(_action);
            }
        }
    },

    actionPlayComplete: function (hAction) {
        let len = this._actions.length;
        for (let i = 0; i < len; i++) {
            let _action = this._actions[i];
            if (_action["$uuid"] === hAction["$uuid"]) {
                let nexthAction = hAction.$getNextAction();
                if (nexthAction) {
                    // 启动单链表下个节点的Action
                    nexthAction.startWithTarget(hAction.getComponent());
                    this._actions[i] = nexthAction;
                }
                hAction.$invalid();
                break;
            }
        }
    },
    __invalidActionAndNext: function (hAction) {
        let nextAct = hAction.$getNextAction();
        while (nextAct) {
            let act = nextAct;
            nextAct = act.$getNextAction();
            act.$invalid();
        }
        hAction.$invalid();
    },

    addActionToInvalidList: function (hAction) {
        if (!(hAction instanceof HAction)) {
            cc.error("HActionEngine -> addActionToInvalidList error: params must be a subclass of HAction!");
        }
        this._tempInvalidIds[hAction["$uuid"]] = hAction; // 下一帧销毁
    },

    update: function (dt) {
        let arr = this._actions;
        if (Object.keys(this._tempInvalidIds).length > 0) {
            for (let uuid in this._tempInvalidIds) {
                this._tempInvalidIds[uuid].$destroy();
            }
            for (let i = 0, flag = true, len = arr.length; i < len; flag ? i++ : i) {
                if (arr[i] && this._tempInvalidIds[arr[i]["$uuid"]]) {
                    arr.splice(i, 1);
                    flag = false;
                } else {
                    flag = true;
                }
            }
            this._tempInvalidIds = {};
        }
        arr.forEach(function (action) {
            let comp = action.getComponent();
            if (!comp || !comp.enabled || !comp.isValid) {
                return;
            }
            action["_$update"](dt);
        });
    }
});
let engine = null;
module.exports = function(){
    if (engine){
        return engine;
    }
    engine = new HActionEngine();
    return engine;
} ;