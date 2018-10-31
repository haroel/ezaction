/**
 * ihowe@outlook.com
 * author by haroel
 * Created by howe on 2017/3/17.
 * HAction核心基类
 */
require("HNodeEx");
let HVars = require("HVars");

// 生成唯一ID
let UUID_GENERATOR = (function () {
    var i = 0;
    return function () {
        return "__HAction_uuid_" + i++;
    }
})();

// HAction核心基类,请不要直接实例化使用
let HAction = cc.Class({
    ctor: function () {
        this.$uuid = UUID_GENERATOR();
        this._delay = 0;
        this._state = ezaction.State.INITIAL;

        this._finishCallback = null;
        this._actionComponent = null;
        this.__nextAction = null;
        this._vars = new HVars();
        this._isStart = false;
        Object.defineProperty(this, "vars", { get: function () { return this._vars; } });
    },
    
    setTag(value) {
        this._vars.tag = value;
    },
    getTag() {
        return this._vars.tag;
    },
    getState: function () {
        return this._state;
    },
    isRunning: function () {
        return this._state === ezaction.State.RUNNING;
    },

    getSpeed: function () {
        return this._vars["speed"];
    },
    /* 是否把加速出啊满地给next */
    setSpeed: function (speedValue) {
        if (speedValue<=0){
            cc.warn("HAction -> setSpeed: speed must be positive number");
            return;
        }
        this._vars["speed"] = speedValue;
        return this;
    },
    
    getVars: function () {
        return this._vars;
    },
    /*
     *  获取HAction作用的cc.Node对象
     * */
    getNode: function () {
        if (this._actionComponent) {
            return this._actionComponent.getTargetNode();
        }
        return null;
    },

    getComponent: function () {
        return this._actionComponent;
    },

    pause: function () {
        if (this._state === ezaction.State.RUNNING){
            this._state = ezaction.State.PAUSED;
        }
        return this;
    },
    resume: function () {
        if (this._state === ezaction.State.PAUSED){
            this._state = ezaction.State.RUNNING;
        }
        return this;
    },


    /*
     * 初始化 (可重写改方法)
     * */
    init: function (vars) {
        this._vars.patchParams(vars);
    },
    /*
     * 开始绑定动作 (请继承以实现更多方法)
     * @ component: HAactionComponent组件
     * @ vars 额外参数 (克隆出需要保留的参数) :
     * 系统支持:delay,onUpdate,onComplete,repeat,actionComponent
     * */
    startWithTarget: function (component) {
        if (this._actionComponent) {
            throw new Error("Error, HAction Had been added! ");
            return;
        }
        this._actionComponent = component;
        this.playAction();
    },

    /* 具体实现请继承 */
    playAction: function () {
        this._state = ezaction.State.RUNNING;
        this._delay = this._vars.delay;
        this._isStart = false;
    },
    /*
     * 执行调度函数, HActionEngine来调度此方法, 外部不可调用！
     * 此处需要区分三种update调用
     * _$update:由 HActionEngine来执行
     *  $update:二级调度方法, ActionInterval来继承调用 外部可继承的$update方法
     *  update: 外部可继承的update方法
     * */
    _$update: function (dt) {
        let vars = this._vars;
        dt = dt * vars.speed;
        if (this._state !== ezaction.State.RUNNING) {
            return;
        }
        // 处理延时调用
        this._delay -= dt;
        if (this._delay <= 0){
            // onStart事件
            if ( !this._isStart ){
                this._isStart = true;
                if ( typeof vars["onStart"] === 'function') {
                    vars["onStart"](this);
                }
            }
            this.$update(dt);
            if (this.isRunning() && typeof vars["onUpdate"] === 'function') {
                vars["onUpdate"](this, dt);
            }
        }
    },
    $update: function (dt) {
        this.update(0);

    },
    /*
     * 请重写改方法以实现更多行为
     * update Action状态
     * @ rate : action进度值 0~1
     * */
    update: function (rate) {
        //TODO What you want to do;

    },

    /*
    * 子类动作结束时请调用该方法
    * */
    $actionComplete: function () {
        let vars = this._vars;
        if (typeof vars["onComplete"] === 'function') {
            vars["onComplete"](this);
        }
        let count = vars.repeat;
        if (count > 0) {
            this.playAction();  // 重置状态
            this.repeat(count - 1);
        } else {
            this._state = ezaction.State.STOPPED;
            if (typeof vars["onStoped"] === 'function') {
                vars["onStoped"](this);
            }
            if (this._finishCallback) {
                this._finishCallback(this, this.$getNextAction());
            }
            if (this._actionComponent) {
                // 注意:playComplete不一定会调用成功,因为某些action是由spawn来维护
                this._actionComponent.playComplete(this);
            }
        }
    },
    $setFinishCallback: function (callback) {
        this._finishCallback = callback;
    },

    $getNextAction: function () {
        return this.__nextAction;
    },
    $setNextAction: function (action, index /* null**/) {
        let _i = 9999999;
        if (typeof index === "number" && index > -1) {
            _i = index;
        }
        let i = 0;
        let preAction = this;
        let nextAct = this.__nextAction;
        while (nextAct) {
            if (i === _i) { break; }
            preAction = nextAct;
            nextAct = nextAct.__nextAction;
            if (!nextAct) {
                break;
            }
            ++i;
        }
        if (nextAct){
            nextAct.destroy();
        }
        preAction.__nextAction = action;
        return action;
    },
    $removeNextAction: function () {
        if (this.__nextAction){
            this.__nextAction.destroy();
        }
        this.__nextAction = null;
    },

    /*
    * then式调用链,可以用链式方法来处理,
    * 建议用then方式来取代Sequence
    * */
    then: function (act) {
        if (this.__nextAction) {
            this.__nextAction.$destroy();
        }
        this.__nextAction = act;
        return this;
    },
    /*
     * 完备克隆action
     * 如果有鏈式结构,会一并克隆下去
     * */
    clone: function () {
        let target = this.cloneSelf();
        let nextAct = this.$getNextAction();
        while (nextAct) {
            target.$setNextAction(nextAct.cloneSelf());
            nextAct = nextAct.$getNextAction();
        }
        return target;
    },
    /**
     * 克隆自身
     * 每个子类独立去实现克隆方法
     */
    cloneSelf: function () {
        return null;
    },

    repeatForever: function () {
        this._vars["repeat"] = Number.MAX_VALUE;
        return this;
    },
    /*
     * 重新repeat播放 value 重复次数
     * */
    repeat: function (value) {
        this._vars["repeat"] = value;
        return this;
    },

    onStart: function (func) {
        if (typeof func === 'function'){
            this._vars["onStart"] = func;
        }
        return this;
    },

    onUpdate: function (func) {
        if (typeof func === 'function'){
            this._vars["onUpdate"] = func;
        }
        return this;
    },
    onComplete: function (func) {
        if (typeof func === 'function'){
            this._vars["onComplete"] = func;
        }
        return this;
    },
    onStoped: function (func) {
        if (typeof func === 'function'){
            this._vars["onStoped"] = func;
        }
        return this;
    },

    destroy:function(){
        if (this._state == ezaction.State.DEAD){
            return;
        }
        if (this._actionComponent) {
            this._state = ezaction.State.DEAD;
            this._actionComponent.destroyAction(this);
        } else {
            this.$destroy();
        }
    }, 

    $invalid: function () {
        if (this._state == ezaction.State.DEAD){
            return;
        }
        if (this._actionComponent) {
            this._state = ezaction.State.DEAD;
            this._actionComponent.addActionToInvalidList(this);
        } else {
            this.$destroy();
        }
    },
    /*
     * 仅继承重写,不可外部调用!!!!!
     * */
    $destroy: function () {
        // cc.log("销毁" + this.$uuid);
        this._state = ezaction.State.DEAD;
        this._vars = null;
        this.__nextAction = null;
        this._finishCallback = null;
        this._actionComponent = null;
    }
});
module.exports = HAction;