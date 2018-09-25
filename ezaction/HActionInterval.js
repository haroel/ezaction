/**
 * ihowe@outlook.com
 * author by haroel
 * Created by howe on 2017/3/21.
 *
 * HActionInterval是基于时间调度的动作基类
 * 
 */

let HActionInterval = cc.Class({
    extends: require("HAction"),
    ctor: function () {
        this._duration = 0.001;
        this._currentTime = 0;
        this._progress = 0;
        this._lastprogress = 0;
    },
    getCurrentTime: function () {
        return this._currentTime;
    },
    /**
     * 动画运行时间
     * 动画的实际运行时间是 duration/speed
     */
    getDuration: function () {
        return this._duration;
    },

    getProgress: function () {
        return this._progress;
    },

    init: function (duration, vars /*null */) {
        if (duration > 0) {
            this._duration = duration;
        }
        this._super(vars);
    },

    playAction: function () {
        this._super();
        this._currentTime = 0;
        this._progress = 0;
        this._lastprogress = 0;
    },
    /*
     * 请重写改方法以实现更多行为
     * update Action状态
     * @ target : HAction类
     * */
    $update: function (dt) {
        this._currentTime += dt;
        if (this._currentTime >= this._duration) {
            this._progress = 1.0;
            this.update(this._progress);
            this.$actionComplete();
        } else {
            this._progress = this._currentTime / this._duration;
            this.update(this._progress);
        }
    },
    /*
    * 扩展以实现更多方法
    * */
    update: function (rate) {
        if ( typeof this._vars["easing"] === 'function') {
            let oldProgress = this._lastprogress;
            this._progress =  this._vars["easing"](this._progress);
            this._lastprogress = this._progress;
            if (oldProgress < 1 && this._progress > 1) {
                if ( typeof this._vars["onArrived"] === 'function') {
                    this._vars["onArrived"](this);
                }
            }
        }
        this._super(this._progress);
        //TODO What you want to do next;

    },

    /**
     * 当HAction设置了缓动函数，有可能出现时间还没到，node越过目标参数的情况，当node越过时，func会被触发
     * **/
    onArrived(func) {
        if (typeof func === "function"){
            this._vars["onArrived"] = func;
        }
        return this;
    },
    /*
     * 参数为缓动函数, 函数定义可查看GEaseDefine.js文件
     * 你可以传入一个自己定义的函数,该函数必须接受progress值来处理
     * */
    easing: function (easeFunc) {
        if (typeof easeFunc === "function") {
            this._vars["easing"] = easeFunc;
        }
        return this;
    },
    /* cloneSelf 不复制方法 */
    cloneSelf: function () {
        let act = new HActionInterval();
        act.init(this.getDuration(), this.getVars());
        return act;
    },
    /*
     * 仅继承重写,不可外部调用,该方法由ActionComponent自动调用!!!!!
     * */
    $destroy: function () {
        this._super();
    }
});

HActionInterval.create = function (duration, vars) {
    let act = new HActionInterval();
    act.init(duration, vars);
    return act;
};

module.exports = HActionInterval;