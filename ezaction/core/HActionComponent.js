/**
 * ihowe@outlook.com
 * author by haroel
 * Created by howe on 2017/3/21.
 *
 * hActionComponent是管理父Node节点的组件。
 * 不允许外部对其直接访问和修改!
 */

module.exports = cc.Class({
    extends: cc.Component,
    
    getTargetNode: function () {
        return this._targetNode;
    },

    getActionEngine(){
        if (!this.actionEngine){
            this.actionEngine = require("HActionEngine")();
        }
        return this.actionEngine;
    },

    __$init: function (targetNode) {
        this._targetNode = targetNode;
    },
    // use this for initialization
    onLoad: function () {
        this._targetNode = this.node;
    },

    addActionToTickQueue: function (hAction) {
        if (hAction.getComponent()) {
            cc.warn("HActionComponent -> addActionToTickQueue warn: 重复添加HAction可能会带来不可知的问题！ ");
            return;
        }
        this.getActionEngine().pushActionToQueue(hAction);
        hAction.startWithTarget(this);
    },

    removeAction: function (hAction) {
        return this.getActionEngine().removeAction(hAction);
    },

    removeActions: function (actions) {
        let ae = this.getActionEngine();
        for (let i = 0; i < actions.length; i++) {
            ae.destroyAction(actions[i]);
        }
    },

    removeAllActions: function () {
        return this.getActionEngine().removeAllActions(this);
    },

    getRunningActions: function () {
        return this.getActionEngine().getRunningActions(this);
    },

    getActionByTag: function (tag) {
        return this.getActionEngine().getActionByTag(this, tag);
    },

    playComplete: function (hAction) {
        return this.getActionEngine().actionPlayComplete(hAction)
    },

    addActionToInvalidList: function (hAction) {
        return this.getActionEngine().addActionToInvalidList(hAction);
    },

    destroyAction:function(hAction){
        return this.getActionEngine().__invalidActionAndNext(hAction);
    },

    onDestroy: function () {
        if (this.actionEngine){
            this.actionEngine.removeAllActions(this);
        }
        this.actionEngine = null;
        this._targetNode = null;
    }
});
