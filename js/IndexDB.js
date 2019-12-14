var db;
function openDB(){
	window.indexedDB=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;
	if(!window.indexedDB){
		alert("你的浏览器不支持indexedDB");
	}
	//打开数据库
	var req=window.indexedDB.open("MyDatabase");
	//让数据库可在任何地方访问，获取数据库对象
	req.onsuccess=function(event){
		db=req.result;
	}
	req.onerror=function(event){
		alert("打开数据库失败");
	}
	req.onupgradeneeded=function(event){
		db=event.target.result;
		var objectStore=db.createObjectStore("rankingList",{ keyPath: "fraction" });
		//objectStore.createIndex("fraction","fraction",{unique:false});
	}
}

function addRankingList(){
	var fractions=document.getElementById("fraction").innerHTML;
	var transaction = db.transaction("rankingList", "readwrite");
    var objectStore = transaction.objectStore("rankingList");
    var req=objectStore.put({fraction:fractions});
    req.onsuccess=function(event){
    	console.log("添加成功");
    }
    req.onerror=function(){
    	alert("添加失败");
    	console.log(event);
    }
}

function showRankingList(){
	var transaction = db.transaction("rankingList", "readonly");
    var objectStore = transaction.objectStore("rankingList");
    var req=objectStore.openCursor(IDBCursor.NEXT);
    var myfraction=document.getElementById("myFraction");
    var str="<table border='1px'><tr><td>分数</td><td>&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>";
    req.onsuccess=function(event){
    	var cursor=event.target.result;
    	if(cursor){
    		str+="<tr><td>"+cursor.value.fraction+"</td><td>"+
				"<button data-score='"+cursor.primaryKey+"' onclick='deleteRankingList(this)'>删除</button></td></tr>";
				cursor.continue();
    	}else{
			str+="</table>";
			myfraction.innerHTML=str;
		}
    }
    req.onerror=function(){
    	myfraction.innerHTML="打开数据库失败。";
    }
}


function deleteRankingList(element) {
	if(confirm("确定要删除吗？")){
		var fractions = element.getAttribute("data-score");
		var transaction = db.transaction("rankingList", "readwrite");
	  	var objectStore = transaction.objectStore("rankingList");
	  	var req = objectStore.delete(fractions);
	  	req.onerror = function (event) {
	  		alert("删除失败：" + req.error);
	  	}
	  	req.onsuccess = function (event) {
	  		//显示数据库中保存的所有得分
	  		showRankingList();
	  	}
	}       
}
