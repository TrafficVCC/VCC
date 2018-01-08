function jysg_start(){
	
	//全局变量
	window.years = ["2014","2015","2016"];
	window.months = "0";
	window.originYears = ["2014","2015","2016"];
	window.originRoads = "0";
	window.yflags = [0,0,0];
	window.roads = "0";
	window.tempRoad = "0";
	window.lockedFlag = 0;	//判定道路是否锁定
	
	//contentA
	$.post("/Demo/TimeServlet",
	{
		"type":"month",   //月份
		"starty" : window.originYears[0],
		"endy" : window.originYears[originYears.length-1],
		"set" : window.roads     //全体
	},
	function(data,status){
	    js = eval('(' + data + ')');
	    console.log("数据：" + data + "\n状态：" + status);
	    console.log("绘制堆栈图");
	    console.log("年份"+window.years);
	    console.log("道路"+window.roads);
	    drawStackedLine(js, "graphA1", clickStackArea, window.yflags);
	});
	
	//contentB
	$.post("/Demo/RoadServlet",
	{
		"type":"lh",   //路号
		"starty" :window.years[0],
		"endy" : window.years[window.years.length-1],
		"set" : "0"     //全体
	},
	function(data,status){
		js = eval('(' + data + ')');
		var lh_dataset = [];
		for(i=0; i<10; i++){
			lh_dataset.push(js[i]);
		}
		console.log(lh_dataset);
	    console.log("绘制list");
	    console.log("年份"+window.years);
	    console.log("道路"+window.roads);
		writeRoadList(lh_dataset, "graphB", clickList);
		
	
	});
	
	//contentC
	
	
	//contentE
	
}
