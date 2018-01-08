function clickbtnA1(){
	document.getElementById("graphA1").style.display="block";
	document.getElementById("graphA2").style.display="none";
}

function clickbtnA2(){
	document.getElementById("graphA1").style.display="none";
	document.getElementById("graphA2").style.display="block";
}

//选择年份点击显示按钮后显示对应折线图
function clickbtnA3(){

		//隐藏堆栈图，显示折线图
		document.getElementById("graphA1").style.display="none";
		document.getElementById("graphA2").style.display="block";
		
		//等同于重置
		if(window.yflags==[0,0,0]){
			clickbtnA4();
		}
		
		console.log("是否锁定——"+window.lockedFlag);
		//A2——折线图
		$.post("/Demo/TimeServlet",
		{
			"type":"month",   //月份
			"starty" :window.years[0],
			"endy" : window.years[years.length-1],
			"set" : window.roads
		},
		function(data,status){
			js = eval('(' + data + ')');
		//	    console.log("数据：" + data + "\n状态：" + status);
			console.log("折线图");
			console.log("年份——"+window.years);
			console.log("道路——"+window.roads);
			drawMonthLine(js, "graphA2", clickPointsOfMonthLine);
		});
	
	
}; 


//重置按钮
function clickbtnA4(){
	$("svg").empty();
	document.getElementById("graphA1").style.display="block";
	document.getElementById("graphA2").style.display="none";
	jysg_start();
}


//选定道路锁定图
function clickbtnB1(){
	window.lockedFlag = 1;
	//道路列表改变
	$.post("/Demo/RoadServlet",
	{
		"type":"lh",   //路号
		"starty" :window.years[0],
		"endy" :window.years[years.length-1],
		"set" :window.roads
	},
	function(data,status){
		js = eval('(' + data + ')');
		var lh_dataset = js;
		console.log(lh_dataset);
		writeRoadList(lh_dataset, "graphB", clickList);
	});
	
//	$.post("/Demo/OtherServlet",               //各种其他因素 
//    {
//    	"type": "factor",
//    	"starty" :window.years[0],
//    	"endy" :window.years[years.length-1],
//    	"set" :window.roads    
//    },
//    function(data,status){
//       	js = eval('(' + data + ')');
//        // console.log("数据：" + data + "\n状态：" + status);
//       	drawParallelAxis(js,"graphC", clickAttr);	
//    });
	
	
}

//点击属性图
function clickAttr(){
	
};

//点击堆栈图区域
function clickStackArea(d){
//	alert(d);
//		if(window.yflags==[0,0,0]){
//			window.years = window.originYears;
//		}

		if(window.lockedFlag==0){
			//没有锁定道路
			window.roads = "0";
			
//			堆积图
			$.post("/Demo/TimeServlet",
			{
				"type":"month",   //月份
				"starty" : window.originYears[0],
				"endy" : window.originYears[originYears.length-1],
				"set" : window.roads     //全体
			},
			function(data,status){
			    js = eval('(' + data + ')');
//			    console.log("数据：" + data + "\n状态：" + status);
			    console.log("绘制堆积图");
				console.log("年份——"+window.years);
				console.log("道路——"+window.roads);
		    	drawStackedLine(js, "graphA1", clickStackArea, window.yflags);
			});
		
			//B —— 道路list更新
			$.post("/Demo/RoadServlet",
			{
				"type":"lh",   //路号
				"starty" :window.years[0],
				"endy" :window.years[years.length-1],
				"set" :window.roads
			},
			function(data,status){
				js = eval('(' + data + ')');
				var lh_dataset = [];
				for(i=0; i<10; i++){
					lh_dataset.push(js[i]);
				}
				console.log(lh_dataset);
				console.log("绘制道路list");
				console.log("年份——"+window.years);
				console.log("道路——"+window.roads);
				writeRoadList(lh_dataset, "graphB", clickList);
			});
			
			//C —— 更新属性图
			$("svg#graphC").empty();
			
			//E —— 更新
			$("svg#graphE").empty();
			
		}
		else{//锁定道路，
			 //改变时间要改变该条道路关于时间的属性图和路况图
//			alert("道路已锁定为"+window.roads;
			$.post("/Demo/RoadServlet",           
	        {
	        	"type": "jysg_jdwz",
	        	"starty" :window.years[0],
				"endy" :window.years[years.length-1],
				"set" :window.roads    
	        },
	        function(data,status){
	        	js = eval('(' + data + ')');
	        	console.log("绘制路况");
				console.log("年份——"+window.years);
				console.log("道路——"+window.roads);
	        	drawCountOnRoad(js, "graphE", clickCountLine);
	       	});
			
			
			$.post("/Demo/OtherServlet",               //各种其他因素 
				    {
				    	"type": "factor",
				    	"starty" :window.years[0],
				    	"endy" :window.years[years.length-1],
				    	"set" :window.roads    
				    },
				    function(data,status){
				       	js = eval('(' + data + ')');
				        // console.log("数据：" + data + "\n状态：" + status);
				       	drawParallelAxis(js,"graphC", clickAttr);	
				    });
			
			

			
		}
	

}


//点击折线图的圆点
function clickPointsOfMonthLine(d){
//	alert(d);
//	console.log(window.years);
//	console.log(window.months);


}

//点击道路list
function clickList(d){
//	alert(d);
	
//	堆积图
	$.post("/Demo/TimeServlet",
	{
		"type":"month",   //月份
		"starty" : window.originYears[0],
		"endy" : window.originYears[originYears.length-1],
		"set" : window.roads     //全体
	},
	function(data,status){
	    js = eval('(' + data + ')');
//	    console.log("数据：" + data + "\n状态：" + status);
	    console.log("绘制堆积图");
		console.log("年份——"+window.years);
		console.log("道路——"+window.roads);
    	drawStackedLine(js, "graphA1", clickStackArea, window.yflags);
	});

//	折线图
	$.post("/Demo/TimeServlet",
	{
		"type":"month",   //月份
		"starty" :window.years[0].toString(),
		"endy" : window.years[years.length-1].toString(),
		"set" : window.roads     //全体
	},
	function(data,status){
	    js = eval('(' + data + ')');
//	    console.log(js);
		console.log("折线图");
		console.log("年份——"+window.years);
		console.log("道路——"+window.roads);
	    drawMonthLine(js, "graphA2", clickPointsOfMonthLine);
	});
	
	//	属性图
	$.post("/Demo/OtherServlet",               //各种其他因素 
			{
		    	"type": "factor",
		    	"starty" :window.years[0],
		    	"endy" :window.years[years.length-1],
		    	"set" :window.roads    
		    },
		    function(data,status){
		       	js = eval('(' + data + ')');
		        // console.log("数据：" + data + "\n状态：" + status);
		       	drawParallelAxis(js,"graphC", clickAttr);	
		    });
	
	//道路拟合
	$.post("/Demo/RoadServlet",           
	{
	    "type": "jysg_jdwz",
	    "starty" :window.years[0],
		"endy" :window.years[years.length-1],
		"set" :window.roads    
	},
	function(data,status){
    	js = eval('(' + data + ')');
    	console.log("绘制路况");
		console.log("年份——"+window.years);
		console.log("道路——"+window.roads);
	 	drawCountOnRoad(js, "graphE", clickCountLine);
	});

	
}


function clickCountLine(d){
	
	
}
