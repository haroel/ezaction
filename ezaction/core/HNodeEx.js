/**
 * ihowe@outlook.com
 * author by haroel
 * Created by howe on 2017/3/21.
 */

let HActionComponent = require("HActionComponent");

let NodePrototype = cc.Node.prototype;

NodePrototype.RunAction = function (HAction) {
    if (!this._components) {
        return;
    }
    let component = this.getComponent(HActionComponent);
    if (!component) {
        this.addComponent(HActionComponent);
        component = this.getComponent(HActionComponent);
        component.__$init(this);
    }
    component.addActionToTickQueue(HAction);
    return HAction;
};

NodePrototype.RemoveAction = function (HAction) {
    if (!this._components) {
        return;
    }
    let component = this.getComponent(HActionComponent);
    if (component) {
        component.removeAction(HAction);
    }
};

NodePrototype.RemoveActionByTag = function (tag){
    if (!this._components) {
        return;
    }
    let act = this.GetActionByTag(tag);
    if (act){
        this.RemoveAction(act);
    }
}

NodePrototype.RemoveAllActions = function () {
    if (!this._components) {
        return;
    }
    let component = this.getComponent(HActionComponent);
    if (component) {
        component.removeAllActions();
    }
};

NodePrototype.StopAllActions = NodePrototype.RemoveAllActions;

NodePrototype.GetRunningActions = function (){
    if (!this._components) {
        return [];
    }
    let component = this.getComponent(HActionComponent);
    if (component) {
        return component.getRunningActions();
    }
    return [];
}

NodePrototype.GetActionByTag = function (tag) {
    if (!this._components) {
        return null;
    }
    let component = this.getComponent(HActionComponent);
    if (component) {
        return component.getActionByTag(tag);
    }
    return null;
};

NodePrototype.RemoveEZActionComponent = function () {
    this.removeComponent(HActionComponent);
}