function showSpaceAnalyze(){
	$("svg").empty();
	document.getElementById("content1").style.display="none";
	document.getElementById("content2").style.display="block";
//	$.post("/Demo/RoadServlet",
// 		{
// 			"type":"lh",   //路号
// 			"starty" :"2006",
// 			"endy" : "2016",
// 			"set" : "0"     //全体
// 	    },
//      function(data,status){
// 	    	js = eval('(' + data + ')');
//	画事故数量大于num的lh的饼图
// 	    	gragh = "spaceA";
// 	    	var num,num1;
// 	    	num = 300;
// 	    	num1=0;
// 	    	var dataset = [];
// 	    	data.forEach(function(d, i){
// 	    	    if(d.count >= num)
// 	    	        dataset.push([d.lh, d.count]);
// 	    	    else
// 	    	    	num1+=d.count;
// 	    	});
//
// 	    	drawRoadPie(dataset, graph, clickRoadPie);
//    	});
	
	drawRoadPie(lh, "spaceA", clickRoadPie);
			
	
	function clickRoadPie(d){
		
		var num = d.data[0];
		alert(num);
		
	//	$.post("/Demo/TimeServlet",
	//   			 {
	//   			"type":"week",   //星期
	//   			"starty" :"2006",
	//   			"endy" : "2016",
	//   			"set" : num     //全体
	//   	    },
	//          function(data,status){
	//   	    	js = eval('(' + data + ')');
	//              console.log("数据：" + data + "\n状态：" + status);
	//              graph = "spaceC";
	//              
	//              drawRoseGraph(js, graph, show);
	//              
	//      	});
		drawRoseGraph(week, "spaceC", function(d){
	        alert(1);
		});
		
	//	$.post("/Demo/TimeServlet",
	//  {
	//      "type":"year",   //年份
	//      "starty" :"2006",
	//      "endy" : "2016",
	//      "set" :num     //全体
	//  },
	//  function(data,status){
	//      js = eval('(' + data + ')');
	//      console.log("数据：" + js + "\n状态：" + status);
	//      graph = "spaceD";
	//		drawLineByYear(js, graph, show);
	//  });
		drawLineByYear(year, "spaceD", show);
	}
	
	function show(){
	
	}
}

