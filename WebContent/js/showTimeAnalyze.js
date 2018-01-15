	function showTimeAnalyze(){
		$("svg").empty();
		document.getElementById("content1").style.display="block";
		document.getElementById("content2").style.display="none";
		
		
   	$.post("/Demo/TimeServlet",
     	{
	  		"type":"year",   //年份
	  		"starty" :"2006",
	  		"endy" : "2016",
	  		"set" : "0"     //全体
	 	},
        function(data,status){
	 	    js = eval('(' + data + ')');
            console.log("数据：" + js + "\n状态：" + status);
            graph = "timeA";
            drawLineByYear(js, graph, clickYearPoint);
   	    });

        
        $.post("/Demo/TimeServlet",
			 {
			"type":"quarter",   //季度
			"starty" :"2006",
			"endy" : "2016",
			"set" : "0"     //全体
	    },
            function(data,status){
	    	js = eval('(' + data + ')');
            console.log("数据：" + data + "\n状态：" + status);
            graph = "timeC"+"1";
            drawRoseGraph(js, graph, show);
   	    });

        
        $.post("/Demo/TimeServlet",
		{
			"type":"month",   //月份
			"starty" :"2006",
			"endy" : "2016",
			"set" : "0"     //全体
	    },
            function(data,status){
	    	js = eval('(' + data + ')');
            console.log("数据：" + data + "\n状态：" + status);
            graph = "timeC"+"2";
            drawRoseGraph(js, graph, show);
   	    });

		$.post("/Demo/TimeServlet",
			 {
			"type":"week",   //星期
			"starty" :"2006",
			"endy" : "2016",
			"set" : "0"     //全体
	    },
            function(data,status){
	    	js = eval('(' + data + ')');
            console.log("数据：" + data + "\n状态：" + status);
            graph = "timeC"+"3";
            drawRoseGraph(js, graph, show);
   	    });
		
	
	
	///////////////////////////
	//点击年代折线图的点
	/////////////////////////
	function clickYearPoint(d){
		var year = d[0];
	
		$.post("/Demo/CalendarServlet",
	   	    {
				"year": year,
				"month": "0"	//0代表全年所有月份
		 	},
	        function(data,status){
		 	    
		 	    js = eval('(' + data + ')');
//		 	    alert(js);
	            for(var i=0; i<js.length; i++) {
	            	console.log(js[i]);
	            }
	            graph = "timeD";
	            drawYearCal(parseInt(year), js, graph, clickCal);
		     });
	}
	
	/////////////////////
	//点击玫瑰图
	/////////////////////
	function show(d){
			
	}
	
	////////////////////////////
	//点击日历
	///////////////////////
	function clickCal(d){
//		var layer = layui.layer;
		var date = d[0];
		var getDate = d3.time.format('%x');
		var strs = getDate(date).split("/");
		var str= strs[2]+"年"+strs[0]+"月"+strs[1]+"日  事故数量:"+d[1].toString();
		
		layer.msg(str);
	}


}
	
	