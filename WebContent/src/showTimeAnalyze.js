	function showTimeAnalyze(){
		$("svg").empty();
		document.getElementById("content1").style.display="block";
		document.getElementById("content2").style.display="none";
		
		
        drawLineByYear(year, "timeA", clickYearPoint);

		drawRoseGraph(quarter, "timeC1", show);

		drawRoseGraph(month, "timeC2",show);

		drawRoseGraph(week, "timeC3",show);
		
		
	function clickYearPoint(d){
			var year = d[0];
	
			d3.json("data/test.json", function(error,data){
				var syear = 2006;
				console.log(data);
				drawYearCal(syear, data, "timeD", clickCal);
			
			});
		}
	
	function show(d){
			
	}
	function clickCal(d){
		var layer = layui.layer;
		layer.msg("hello");
	}


}
	
	