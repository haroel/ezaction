/*
 * @CreateTime: Jan 23, 2018 1:49 PM
 * @Author: howe
 * @Contact: ihowe@outlook.com
 * @Last Modified By: howe
 * @Last Modified Time: Sep 13, 2018 11:37 AM
 * @Description: ezaction的TS接口描述文件
 * 
 */

/** require模块方法 */
declare function require(moduleName:string):any;

/**
 * cc.Node的prototype新增部分方法
 */
declare namespace cc {
    export interface Node {
        /***
         * Run HAction实例，这个Action的作用对象是当前cc.Node
         */
        RunAction(act: ezaction.HAction): ezaction.HAction;
        /**
         * 删除action
         */
        RemoveAction(action: ezaction.HAction): void;

                /**
         * 删除action
         */
        RemoveActionByTag(tag: number): void;

        /**
         * 删除当前节点的所有HAction
         */
        RemoveAllActions(): void;
        /**
         * 停止当前节点的HAction，等同于RemoveAllActions
         */
        StopAllActions(): void;
        /**
         * 获取当前节点上正在运行的action
         */
        GetRunningActions(): Array<ezaction.HAction>;
        /**
         * 根据tag获取HAction
         */
        GetActionByTag(tag: number): ezaction.HAction;
        /**
         * 删除HActionComponent，这将导致当前节点的所有的HAction无效
         */
        RemoveEZActionComponent(): void;
    }
}

declare namespace ezaction {

    export class CustomEase{
        getRatio(progress:number):number;
    }
    export class HCustomEase{
        static create(id:string,data:string,config:any = null):CustomEase;
    }
    /**
     * 缓动模块 该模块只对HActionInterval和其子类有效果
     */
    export module ease {
        function backEaseIn(rate: number = 3.0): Function;
        function easeIn(rate: number = 3.0): Function;
        function easeOut(rate: number = 2): Function;
        function easeInOut(rate?: number): Function;
        function easeBackOut(rate?: number = 1.70158): Function;
        function EaseElasticIn(rate: number): Function;
        function EaseElasticOut(rate: number): Function;
        function backEaseOut(rate: number): Function;
        function sineEaseOut(rate: number): Function;
        function sineEaseIn(rate: number): Function;
        function cubicEaseOut(rate: number): Function;
        function customEase( customEase: CustomEase ): Function;
    }
    /**
     * HAction的状态
     * 0 表示初始化,1表示运行,2表示暂停,3表示停止,4表示销毁
     */
    export enum State {
        INITIAL = 0,
        RUNNING = 1,
        PAUSED = 2,
        STOPPED = 3,
        DEAD = 4
    }

    export class HActionComponent extends cc.Component {
    }

    export class HAction {

        /**
         * 唯一id
         */
        readonly $uuid: string;
        /**
         * vars变量，HVars的实例
         */
        readonly vars: any;
        /**
         * vars变量，HVars的实例
         */
        getVars(): any;
        
        /**
         * 设置tag值
         * @param value 
         */
        setTag(value: number): void;
        /**
         * 获取tag
         */
        getTag(): number;
        /**
         * 当前HAction的状态
         */
        getState(): ezaction.State;
        /**
         * 当前HAction是否正在运行
         */
        isRunning(): boolean;
        /**
         * 当前HAction速度 ，1为正常速度，数字越大，运行越快
         */
        getSpeed(): number;
        /**
         * 设置HAction速度 ，1为正常速度，数字越大，运行越快
         */
        setSpeed(value: number): HAction;

        /**
         * 当前HAction作用的Node节点
         */
        getNode(): cc.Node;
        /**
         * 当前HAction作用的Node上的
         */
        getComponent(): HActionComponent;
        /**
         * 初始化 
         * @param vars 任意变量对象
         */
        init(vars: any = null): void;
        /**
         * update调用，请覆盖重新该方法而不要手动去调用
         * @param rate 0~1之间
         */
        update(rate: number): void;
        /**
         * 暂停（只有运行状态才可以暂停）
         */
        pause(): HAction;
        /**
         * 恢复（只有暂停状态才可以恢复运行）
         */
        resume(): HAction;
        /*
        * then式调用链,可以用链式方法来处理,
        * 建议用then方式来取代Sequence
        * */
        then(act: HAction): HAction;
        /*
        * 完备克隆action
        * 如果有鏈式结构,会一并克隆下去
        * */
        clone(): HAction;
        /**
         * 克隆自身
         * 每个子类独立去实现克隆方法
         */
        cloneSelf(): HAction;
        /**
         * 无限重复该HAction
         */
        repeatForever(): HAction;
        /*
        * 重新repeat播放 value 重复次数
        * */
        repeat(value: number): HAction;
        /*
        * onUpdate回调
        * */
        onStart(callFunc: Function): HAction;
        /*
        * onUpdate回调
        * */
        onUpdate(callFunc: Function): HAction;
        /*
        * 完成回调，注意如果设置了repeat次数，则该回调会触发repeat次
        * */
        onComplete(callFunc: Function): HAction;
        /**
         * 停止回调，所有的repeat执行完成后调用。在onComplete触发之后
         * @param callFunc 
         */
        onStoped(callFunc: Function): HAction;
        /**
         * 销毁当前HAction，注意：HAction标记为销毁的节点只会在下一帧才会真正销毁掉。
         */
        destroy();
        
        protected startWithTarget(component: HActionComponent): void;

        protected playAction(): void;

        protected _$update(dt: number): void;

        protected $update(dt: number): void;

        protected $invalid(): void;

        protected $destroy(): void;
    }
    /**
     * Spawn同时运行Action，类似cc.Spawn
     */
    export class HActionSpawn extends HAction {
        static create(actions: Array<HAction>, vars: any = null): HActionSpawn
    }
    /**
     * Spawn串联运行Action，类似cc.Sequence
     */
    export class HActionSequence extends HAction  {
        static create(actions: Array<HAction>, vars: any = null): HActionSequence
    }
    /**
     * 瞬时执行，执行一帧后完成
     */
    export class HActionInstant extends HAction {
        static create(vars: any = null): HActionInstant
    }
    /**
     * HActionInterval是基于时间调度的动作基类
     */
    export class HActionInterval extends HAction {
        getCurrentTime(): number;

        getDuration(): number;

        getProgress(): number;

        init(duration: number, vars:any = null /*null */): void;
        /*
        * 参数为缓动函数, 函数定义可查看GEaseDefine.js文件
        * 你可以传入一个自己定义的函数,该函数必须接受progress值来处理
        * */
        easing(easeFunc: Function): HActionInterval
        /**
         * 当HAction设置了缓动函数，有可能出现时间还没到，node越过目标参数的情况，当node越过时，func会被触发
         * **/
        onArrived(func: Function): HActionInterval

        static create(duration: number, vars:any = null): HActionInterval;
    }
    export class HActionTweenBase extends HActionInterval {
        setTarget(objOrNode:any):void;
        getTarget():any;
    }

    export class HActionTween extends HActionTweenBase {
        static create(vars: any = null): HActionTween
    }

    export class HActionTweenBy extends HActionTweenBase {
        static create(vars: any = null): HActionTweenBy
    }

    export class HActionJumpBy extends HActionInterval {
    }

    export class HActionJumpTo extends HActionJumpBy {
    }

    export function v2(x: number | { x: number, y: number }, y: number): { x: number, y: number };

    export function callFuncWithParam(func: Function, ...aArgs): ezaction.HActionInstant;
    export function callFunc(func: Function, params: any = null, vars:any = null): ezaction.HActionInstant;

    export function delay(duration: number, vars:any = null): ezaction.HActionInterval;

    export function sequence(actions: Array<ezaction.HAction>, vars:any = null): ezaction.HActionSequence;

    export function spawn(actions: Array<ezaction.HAction>, vars:any = null): ezaction.HActionSpawn;

    export function tween(duration: number, params: any, vars:any = null): ezaction.HActionTween;

    export function tweenBy(duration: number, params: any, vars:any = null): ezaction.HActionTweenBy;

    export function moveTo(duration: number, params: any, vars:any = null): ezaction.HActionTween;
    export function moveBy(duration: number, params: any, vars:any = null): ezaction.HActionTweenBy;

    export function scaleTo(duration: number, params: any, vars:any = null): ezaction.HActionTween;
    export function scaleBy(duration: number, params: any, vars:any = null): ezaction.HActionTweenBy;

    export function skewTo(duration: number, params: any, vars:any = null): ezaction.HActionTween;
    export function skewBy(duration: number, params: any, vars:any = null): ezaction.HActionTweenBy;

    export function rotateTo(duration: number, numberOrObj: number|any, vars:any = null): ezaction.HActionTween;
    export function rotateBy(duration: number, numberOrObj: number|any, vars:any = null): ezaction.HActionTweenBy;

    export function fadeTo(duration: number, opacity: number, vars:any = null): ezaction.HActionTween;
    export function fadeIn(duration: number, vars:any = null): ezaction.HActionTween;
    export function fadeOut(duration: number,   vars:any = null): ezaction.HActionTween;

    export function show( vars:any = null): ezaction.HActionInstant;
    export function hide( vars:any = null): ezaction.HActionInstant;

    export function jumpBy( duration:number, pos:{x:number,y:number}, height:number, jumps:number, vars:any = null ): ezaction.HActionJumpBy;
    export function jumpTo( duration:number, pos:{x:number,y:number}, height:number, jumps:number, vars:any = null ): ezaction.HActionJumpTo;

}