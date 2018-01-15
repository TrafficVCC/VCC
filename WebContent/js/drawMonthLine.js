//data 结构为[{"year":d, "count":[d]}, …… ].

function drawMonthLine(data, svgId, func){
//	$("svg#"+svgId).empty();
	var smonth;
	var dataset =[0,0,0,0,0,0,0,0,0,0,0,0];
//	console.log(data);
	data.forEach(function(d,i){
		var a = d.count;
		a.forEach(function(d,i){
			dataset[i]+=d;
		});
		
//		console.log(dataset);
	})
	
	//提取svg的宽度长度
	var width = d3.select("#"+svgId).attr("width");
	var height = d3.select("#"+svgId).attr("height");
	//边缘
	var padding = {top:(50), right:(100), bottom:(50), left:(50) };
	
	var lineWidth = height/80;

	var maxCount = d3.max(dataset);
	var minCount = d3.min(dataset);

//	console.log(maxCount);

	var xScale = d3.scale.linear()
			        .domain([1, 12])
			        .range([0, width - padding.left - padding.right]);
	var yScale = d3.scale.linear()  
                	.domain([minCount/2, maxCount])
                	.range([height - padding.bottom - padding.top, 0]);
	
	 var s = d3.select("#"+svgId);
    
    //坐标轴
    s.selectAll("g.axis").remove();
    var x_axis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");
//                  .ticks(dataset.length-1);
    var y_axis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");
    s.append("g")
		.attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
        .call(x_axis);
    s.append("g")
    	.append("text")
        .text("月份")
        .attr("transform", "translate(" + (width-padding.right/1.5) + "," + (height - padding.bottom) + ")");
	s.append("g")
		.attr("class", "axis")
		.attr("transform", "translate("+ padding.left +"," + padding.top + ")")
		.call(y_axis);
	s.append("g")
		.append("text")
        .text("事故数量")
        .attr("transform", "translate(" + 0 + "," +  padding.bottom/2 + ")");
    
     var linePath = d3.svg.line()
    	.x(function(d,i){
            return xScale(i+1) + padding.left;
        })
        .y(function(d){
            return yScale(d) + padding.top;
        });
        
    var l = s.selectAll("path.sline");
	var updateL = l.data(dataset);
	var enterL = updateL.enter();
	var exitL  = updateL.exit();
	exitL.remove();
	
	updateL.transition()
        .attr("d",linePath(dataset));
	
	enterL.append("path")
		.attr("class", "sline")
		.attr("d", linePath(dataset))
		.attr("stroke", d3.rgb(62,82,91))
        .attr("stroke-width", (height/100))
        .attr("fill", "none");
    
    //画点
    var p = s.selectAll("circle.c");
    var updatePoints = p.data(dataset);
    var enterPoints = updatePoints.enter();
    var exitPoints = updatePoints.exit();
    exitPoints.remove();
    
    updatePoints.attr('cx', function(d,i) {
            return xScale(i+1)+padding.left;  
        })  
        .attr('cy', function(d) {  
            return yScale(d)+padding.top;  
        })
        .attr('r', function() {  
            return Math.sqrt(height/7);  
        })
        .attr("fill", d3.rgb(62,82,91) )
        .on("click", function(d){
        	
			smonth = d[0];
			var str = syear.toString()+","+smonth.toString();
//			alert(str);
			func();
		});
		
	enterPoints.append("circle")
	    .attr("class", "c")
	    .attr('cx', function(d,i) {
            return xScale(i+1)+padding.left;  
        })  
        .attr('cy', function(d) {  
            return yScale(d)+padding.top;  
        })
        .attr('r', function() {  
            return Math.sqrt(height/7);  
        })
        .attr("fill", d3.rgb(62,82,91) )
        .on("click", function(d){
        	
			smonth = d[0];
			var str = syear.toString()+","+smonth.toString();
//			alert(str);
			window.months = d[0];
			func(window.months);
		});
		
		//文本
		var t = s.selectAll("text.t");
	    var updateText = t.data(dataset);
	    var entertText = updateText.enter();
	    var exitText = updateText.exit();
	    exitText.remove();
	    
	    updateText.text(function(d){
	    	return d;
	    })
            .attr("x", function(d,i){
                return xScale(i+1) +padding.left -15;
            })
            .attr("y", function(d) {
                return yScale(d) +padding.top -20;
            })
            .attr("fill", d3.rgb(62,82,91));
        
        entertText.append("text")
        	.attr("class", "t")
        	.text(function(d){
	    	return d;
	    })
            .attr("x", function(d,i){
                return xScale(i+1) +padding.left -15;
            })
            .attr("y", function(d) {
                return yScale(d) +padding.top -20;
            })
            .attr("fill", d3.rgb(62,82,91));
            
            
}