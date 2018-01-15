function showSpaceAnalyze(){
	$("svg").empty();
	document.getElementById("content1").style.display="none";
	document.getElementById("content2").style.display="block";
	$.post("/Demo/RoadServlet",
	   		{
	   			"type":"lh",   //路号
	   			"starty" :"2006",
	   			"endy" : "2016",
	   			"set" : "0"     //全体
	},
	function(data,status){
	   	    	js = eval('(' + data + ')');
	//	画事故数量大于num的lh的饼图
	   	    	graph = "spaceA";
	   	    	var num,num1;
	   	    	num = 300;
	   	    	num1=0;
	   	    	var dataset = [];
	   	    	js.forEach(function(d, i){
	   	    	    if(d.count >= num)
	   	    	        dataset.push(d);
	   	    	    else
	   	    	    	num1+=d.count;
	   	    	});
	
	   	drawRoadPie(dataset, graph, clickRoadPie);
	});
			
	
	function clickRoadPie(d){
		
		var num = d.data[0];
		$.post("/Demo/TimeServlet",
      	    {
      	     	"type":"week",   //星期
      	     	"starty" :"2006",
      	     	"endy" : "2016",
      	     	"set" : num     //全体
      	    },
      	    function(data,status){
      	     	js = eval('(' + data + ')');
      	        console.log("数据：" + data + "\n状态：" + status);
      	        graph = "spaceC";
        
      	        drawRoseGraph(js, graph, show1);
      	    });
	
      		$.post("/Demo/TimeServlet",
      	    {
      	        "type":"year",   //年份
      	        "starty" :"2006",
      	        "endy" : "2016",
      	        "set" :num     //全体
      	    },
      	    function(data,status){
      	        js = eval('(' + data + ')');
      	        console.log("数据：" + js + "\n状态：" + status);
      	        graph = "spaceD";
      			drawLineByYear(js, graph, show2);
      	    });
      	}
	
	//点击星期玫瑰图
	function show1(){
	
	}
	
	//点击折线图
	function show2(){
		
	}
}

