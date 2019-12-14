var btn1=document.getElementById("btn1");
var btn2=document.getElementById("btn2");
var btn3=document.getElementById("btn3");
var btn4=document.getElementById("btn4");
var rank=document.getElementById("rank");
var speed=200;//速度
var presentRank=btn1;//当前的困难等级
rank.innerHTML=btn1.innerHTML;
//获取元素当前样式
function getStyle(obj,name){
	if(window.getComputedStyle){
		return	getComputedStyle(obj,null)[name];
	}
	else{
		return obj.currentStyle[name];
	}
}

// 用来向一个元素中添加指定的class属性值
function addClass(obj,name){
	obj.className+=" "+name;
}

// 判断一个元素中是否含有指定的class属性值
function hasClass(obj,name){
	var reg=new RegExp("\\b"+name+"\\b");
	return reg.test(obj.className);
}

// 定义一个函数，删除一个元素中指定的class属性值
function removeClass(obj,name){
	var reg=new RegExp("\\b"+name+"\\b");
	var regs=/\s/;
	obj.className=obj.className.replace(reg,"")
	obj.className=obj.className.replace(regs,"");
}

/*
 * toggleClass可以用来切换一个类
 * 如果元素中具有该类，则删除
 * 如果元素中没有该类，则添加
 */
function toggleClass(obj,name){
	if(hasClass(obj,name)){
		removeClass(obj,name);
	}else{
		addClass(obj,name);
	}
}



btn1.onclick=function(){
	speed=150;
	rankClick(btn1);
}

btn2.onclick=function(){
	speed=125;
	rankClick(btn2);
}

btn3.onclick=function(){
	speed=85;
	rankClick(btn3);
}

btn4.onclick=function(){
	speed=50;
	rankClick(btn4);
}

//单击难度按钮，修改按钮样式
function rankClick(obj){
	var selectRank=obj;
	if(presentRank!=selectRank && !hasClass(selectRank,"check")){
		toggleClass(selectRank,"check");
		toggleClass(presentRank,"check");
	}
	presentRank=selectRank;
	rank.innerHTML=obj.innerHTML;
}
