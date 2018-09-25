# ezaction
An extension animation framework for cocos creator.

基于cocos creator的 2D 动画扩展库，接口简单易理解，支持自定义缓动曲线（缓动曲线算法源于greensock https://greensock.com/customease）


### 举很多🌰 

        
1. 执行一个moveTo动作

			let act = ezaction.moveTo(2.0,cc.v2(200,200));
			// 使用和cocos类似，不过首字母大写，详细请查看ezaction/ezaction.d.ts
			this.node.RunAction(act); 

2. 延时动作

		    //delay1秒
		    let act = ezaction.delay(1.0); 
		    // 加速2倍
		    act.setSpeed(2.0);

3. 延迟4秒执行moveBy,并repeat10次 

		    let act = ezaction.moveBy(2.0,cc.v2(200,200),{delay:4.0}).repeat(10);
		    this.node.RunAction(act);

4. ezaction的属性动态动画

    和cocos的action不一样，ezaction可以指定动画目标对象，也就是说动画的目标可以不是cc.Node
    HActionTweenBase的setTarget方法可以修改目标对象，HActionTween和HActionTweenBy继承了HActionTweenBase。
    
    <a name="fenced-code-block">你唯一需要注意的是tween定义的属性名必须在target上能够找到。</a>
    如果你使用过tweenlite，你可能非常容易理解这种使用方式。

		    let target = {
		        hp:0,
		        mp:11,
		        cp:2
		    }
		    let act = ezaction.tween(2.0,{hp:100,mp:233});
		    act.setTarget(target);
		    act.onStoped( ()=>{
		        cc.log(target);
		    } )
		    this.node.RunAction(act);

5. repeatForever? 支持的!
 
		    let act = ezaction.moveBy(2.0,cc.v2(200,200),{delay:4.0}).repeatForever();
		    this.node.RunAction(act);
    
6. 在上一个动作执行完成之后,紧接着执行一个scale动作

		    let act = ezaction.moveBy(2.0,cc.v2(200,200),{delay:4.0}).then(ezaction.scaleTo(0.4,{scaleX:3.0,scaleY:2.0}));
		    this.node.RunAction(act);
    
7. Sequence 或Spawn ? 支持的! 

		    let act = ezaction.spawn( [ezaction.moveBy(2.0,cc.v2(200,0),{delay:0.5}), ezaction.scaleTo(3.3,{scaleX:3.0,scaleY:2.0})]  );
		    this.node.RunAction( act.repeat(5) ); // spawn 5次
		    
		    let act = ezaction.sequence( [ezaction.moveBy(2.0,cc.v2(200,0),{delay:1.0}), ezaction.scaleTo(3.3,{scaleX:3.0,scaleY:2.0}) ]  );
		    this.node.RunAction( act );
    
8. Action执行完成后回调

		    let act = ...
		
		    //每次update回调
		    act.onUpdate(function( action, dt )
		    {
		    });
		
		    //act 完成，如果repeat 三次，则onComplete回调三次
		    act.onComplete(function( action )
		    {
		    });
		
		    //act 停止
		    act.onStoped(function( action, dt )
		    {
		    });
    
9. 支持缓动。
    
		    let act = ...
		    act.easing(ezaction.ease.easeBackOut(0.5));
		
		    // ezaction兼容了creator的缓动算法
		    act.easing( cc.easeBackIn() );

10.   支持可编程式自定义缓动曲线

		    let ce = ezaction.HCustomEase.create("custom_ease","M0,0 C0.548,0.482 0.62,0.913 0.804,1.02 0.873,1.06 0.938,1.012 1,1");
		    let easeFunc = ezaction.ease.customEase(ce);
		    act.easing( easeFunc );

    你可能会问，类似这样的动画曲线标记字符`M0,0 C0.548,0...`这是怎么来的？
    前面说到过，自定义缓动曲线算法基于greensock提供的开源代码，我在它的核心算法上做了封装。
    幸运的是greensock提供了曲线在线编辑工具，可以非常直观的获取曲线标记字符内容。
    https://greensock.com/customease

    
11. 支持then式语法

		    let act1 = ezaction.scaleTo(0.2,{scale:1.7}).onStoped( ()=>{
		        // TODO
		    } );
		    let act2 = ezaction.scaleTo(0.2,{scale:1}).onStoped(next);
		    // act1执行完毕以后调用act2
		    act1.then(act2);
		    this.node.RunAction(act1);


12. 支持action的pause、resume、clone。



<br><br><br>
## ezaction的继承谱系

![ezaction pedigree](http://aeooh.com/article/res/haction_f.png)

ezaction.tween(ezaction.moveTo/scaleTo/skewTo/fadeTo...)返回的是一个HActionTween类实例，
ezaction.tweenBy(ezaction.moveBy/scaleBy/skewBy...)返回的是一个HActionTweenBy类实例，


    
当然, 还有很多等你发现。。。