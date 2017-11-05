//syear:选择的年份。
//data：该年份中每一天的事故数量。结构:[{"date":"yyyy-mm-dd", "count":xxx},{…,…},……].
//svgId：画布. 画布长宽比应为2:1。
//func:func(d).d[0]:该块代表时间, d[1]:该块事故数量。

//画一年的日历图
function drawYearCal(syear, data, svgId, func){
	var days = d3.time.days(new Date(syear, 0, 1), new Date(syear+1, 0, 1));
	var dataset = [];
	
	var getmonth = d3.time.format('%m');
	var getday = d3.time.format('%d');

	var dataset2 = [];
	var dataset3 = [];
	data.forEach(function(d){
		dataset2.push([d.date.split("-")[1], d.date.split("-")[2], d.count]);
	});
	console.log(dataset3);
	

	days.forEach(function(d, i){
		e = 0;
//		if(dataset3[getmonth(d)][getday(d)]){
//			e = dataset3[getmonth(d)][getday(d)]
		dataset.push(d, e);
	});
	console.log(dataset);

	var max = 0;
	var min = data[0].count;
	data.forEach(function(d){
		max = Math.max(max, d.count);
		min = Math.min(min, d.count);
	});

	
	//颜色
	var color1 = d3.rgb(255,255,255);
    var color2 = d3.rgb(175,0,0);
	var linear = d3.scale.linear()  
        .domain([0,max])  
        .range([0,1]);
    var compute = d3.interpolate(color1,color2); 
	
	
//	var xqTitle = ["日","一","二","三","四","五","六"];
	var xqTitle = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	var monthTitle = [];
	var a = d3.range(0, 12);
	var format = d3.time.format('%b');
	a.forEach(function(d){
		monthTitle.push([d3.time.weekOfYear(new Date(syear, d, 1)), format(new Date(syear, d, 1))]);
	});
	
	var rows = d3.time.weekOfYear(new Date(syear, 12, 0))+1;
	
	var width = d3.select("#"+svgId).attr("width");
	var height = d3.select("#"+svgId).attr("height");	
	var padding = height/10;
	
	var rectsize = Math.min((width - padding*2)/(rows+2), (height-padding*2)/9);
	
	var s = d3.select("#"+svgId);
	
	s.selectAll("g")
		.remove();
	
	var w = s.append("g")
				.attr("id","week");
	var x = w.selectAll("text")
				.data(xqTitle)
				.enter()
				.append("text")
				.attr("x", 0)
				.attr("y", function(d, i){
					return padding+rectsize*(i);
				})
				.attr("fill","#ccc")
//				.attr("font-size", rectsize/2)
				.text(function(d){
					return d;
				});
				
	var m = s.append("g")
				.attr("id", "month")
	var mt = m.selectAll("text")
				.data(monthTitle)
				.enter()
				.append("text")
				.attr("x", function(d){
					return padding+rectsize*(d[0]-1);
				})
				.attr("y", rectsize*1.5)
				.attr("fill","#ccc")
				.text(function(d,i){
					return d[1];
//					return i+1;
				});
	
	//画小方块
	var r = s.selectAll("rect");
  	var updateR = r.data(days);
  	var enterR = updateR.enter();
  	var exitR = updateR.exit();
  	exitR.remove();
  	
  	updateR.attr("id", function(d){
    		return "r"+getmonth(d).toString()+getday(d).toString();
	    })
	  	.attr("width", rectsize)
	    .attr("height", rectsize)
	    .attr("x", function(d){ 
	    	return (d3.time.weekOfYear(d)+2) * rectsize; 
	    })
	    .attr("y", function(d){ 
	    	return (d.getDay()+2) * rectsize; 
	    })
	    .attr("fill", "white")
		.attr("stroke", "#ccc")
	    .on("click", function(d, i){
	    	temp = [d, 0];
			func(temp);
		}); 
	    
    enterR.append("rect")
    	.attr("id", function(d){
    		return "r"+getmonth(d).toString()+getday(d).toString();
    	})
	    .attr("width", rectsize)
	    .attr("height", rectsize)
	    .attr("x", function(d){ 
	    	return (d3.time.weekOfYear(d)+2) * rectsize; 
	    })
	    .attr("y", function(d){ 
	    	return (d.getDay()+2) * rectsize; 
	    })
	    .attr("fill", "white")
	    .attr("stroke", "#ccc")
	    .on("click", function(d, i){
	    	temp = [d, 0];
			func(temp);
	    }); 

	dataset2.forEach(function(d){
		var c = compute(linear(d[2]));
		var str = d[0]+d[1];
		var count = d[2];
		d3.select("#r"+str)
			.attr("fill", c)
			.on("click", function(d){
					temp = [d, count];
					func(temp);
			});
	});
	
}
