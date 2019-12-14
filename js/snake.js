window.onload=function(){	
	var canvas=document.getElementById("myCanvas");//获取画布
	var ctx=canvas.getContext("2d");
	var fraction=document.getElementById("fraction");
	var start=document.getElementById("start");
	var snake=[];//定义一个数组代表蛇
	var snakeCount=4;//蛇的初始长度为4
	var foodx;//食物X坐标
	var foody;//食物Y坐标
	var time;//定时器标记
	var dir=39;//蛇移动的方向，初始向右移动，左：37，上：38，右：39，下：40。
	var score=0;//得分
	openDB();//打开数据库
	//初始化游戏，绘制地图，蛇，食物
	function drawInit(){
		drawMap();
		drawSnake();
		addFood();
	}
	//画地图
	function drawMap(){
		//画横线
		for(var i=0;i<=30;i++){
			ctx.beginPath();//新建一条路径
			ctx.moveTo(0,20*i);//把画笔移动到指定的坐标(x, y)
			ctx.lineTo(600,20*i)//终点坐标
			ctx.moveTo(20*i,0);//把画笔移动到指定的坐标(x, y)
			ctx.lineTo(20*i,600)//终点坐标
			ctx.closePath();//闭合路径之后，图形绘制命令又重新指向到上下文中
			ctx.stroke();//通过线条绘制路径
		}
		
	}
	
	//定义蛇每个元素的坐标
	function snakeCoordinate(){
		for(var i=0;i<snakeCount;i++){
			snake[i]={
				x:20*i,
				y:0
			};
		}
	}
	
	//画蛇
	function drawSnake(){
		for(var i=0;i<snakeCount;i++){
			if(i!=snakeCount-1){
				ctx.fillStyle="skyblue";
			}else{
				ctx.fillStyle="coral";
			}
			ctx.fillRect(snake[i].x,snake[i].y,19,19);
		}
	}
	//生成食物的坐标
	function foodCoordinate(){
		//产生随机坐标，食物出现位置随机
		foodx=Math.floor(Math.random()*30)*20;
		foody=Math.floor(Math.random()*30)*20;
		//判断食物位置是否与蛇的位置重合，如果重合需要重新获取食物的位置
		for(var i=0;i<snakeCount;i++){
			if(foodx==snake[i].x&&foody==snake[i].y){
				foodCoordinate();
			}
		}
	}
	//添加食物
	function addFood(){
		ctx.fillStyle="skyblue"
		ctx.fillRect(foodx,foody,19,19);	
	}
	//判断是否吃到食物
	function isEat(){
		if(snake[snakeCount-1].x==foodx&&snake[snakeCount-1].y==foody){
			foodCoordinate();
			addFood();
			snakeCount++;//蛇的长度+1
			snake.unshift({x:-20,y:-20});//向数组的开头添加一个方块
			score+=10;//每吃到一个食物得分加10
			fraction.innerHTML=score;
		}
	}
	
	//判断是否死亡
	function isDeath(){
		//撞墙死亡
		if(snake[snakeCount-1].x>580||snake[snakeCount-1].y>580||snake[snakeCount-1].x<0||snake[snakeCount-1].y<0){
				clearInterval(time);//停止定时器
				restart=window.confirm("Game Over，你怎么撞墙了？你的得分为"+score);
				addRankingList();//向数据库添加数据
				window.location.reload();//用来重新加载当前页面，作用和刷新按钮一样。	
			}
		//撞自己死亡
		for(var i=0;i<snakeCount-2;i++){
			if(snake[snakeCount-1].x==snake[i].x&&snake[snakeCount-1].y==snake[i].y){
				clearInterval(time);
				restart=window.confirm("Game Over,你怎么吃你自己啦？你的得分为"+score);
				addRankingList();//向数据库添加数据
				window.location.reload();//用来重新加载当前页面，作用和刷新按钮一样。
			}
		}
		
	}
	
	//判断是否通关
	function isUpgrade(){
		if(score>=4500){
			clearInterval(time);
			restart=window.confirm("恭喜你通关本难度，你可以尝试一下其他难度了，你的得分为"+score);
			addRankingList();//向数据库添加数据
			window.location.reload();//用来重新加载当前页面，作用和刷新按钮一样。
		}
	}
	
	//键盘事件，通过按方向键改变蛇的运动方向
	document.onkeydown=function(event){
		event=event||windown.event;//解决兼容性问题
		switch(event.keyCode){
			case 37:{
				if(dir!=39){//禁止控制蛇直接反方向运动
					dir=37;
				}
				break;
			}
			case 38:{
				if(dir!=40){
					dir=38;
				}
				break;
			}
			case 39:{
				if(dir!=37){
					dir=39;
				}
				break;
			}
			case 40:{
				if(dir!=38){
					dir=40;
				}
				break;
			}
		}		
		event.preventDefault();//取消键盘事件的默认动作，按方向键时不会操作滚动条。
	}
	
	//蛇的移动
	function move(){
		switch(dir){
			//push()把一个方块添加到蛇的尾部
			case 37:snake.push({x:snake[snakeCount-1].x-20,y:snake[snakeCount-1].y});break;
			case 38:snake.push({x:snake[snakeCount-1].x,y:snake[snakeCount-1].y-20});break;
			case 39:snake.push({x:snake[snakeCount-1].x+20,y:snake[snakeCount-1].y});break;
			case 40:snake.push({x:snake[snakeCount-1].x,y:snake[snakeCount-1].y+20});break;
		}
		snake.shift();//删除蛇的第一个方块
		isUpgrade();//判断是否通关
		isDeath();//判断是否死亡
		isEat();//判断是否吃到食物
		ctx.clearRect(0,0,600,600);//清除画布重新绘制
		drawInit();//绘制地图，蛇，食物
	}
	
	//给蛇和食物添加坐标
	function init(){
		snakeCoordinate();
		foodCoordinate();
	}
	
	//开始游戏的函数
	function startGame(){
		init();
		time=setInterval(move,speed);
	}
	//初始化地图和蛇
	snakeCoordinate();
	drawInit();
	//开始游戏单击事件
	start.onclick=function(){
		clearInterval(time);
		startGame();
	}
}