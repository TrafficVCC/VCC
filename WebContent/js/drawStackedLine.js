//堆积折线图，点击区域转为单线的折线图。

//data 结构为[{"year":d, "count":[d]}, …… ].
//func1 点击堆积图会调用的函数，func1(d):d是syear 选择年份。
//func2 点击折线图

function drawStackedLine(data, svgId, func1, func2){
	$("svg#"+svgId).empty();
	
	var syear;
	//数据转换
	var dataset1=[];//画图用的数组
	data.forEach(function(d){
		var year = d.year;
		var count = d.count;
		var counts = [];
		count.forEach(function(d,i){
			counts.push({"month":i+1, "count":d});
		});
//		dataset1.push({"year":year, "sg":counts});
		dataset1.push(counts);
	});
	console.log(dataset1);
	var stack = d3.layout.stack()
					.values(function(d){ return d; })  
                    .x(function(d){ return d.month; })  
                    .y(function(d){ return d.count; });  
	var dataset2 = stack(dataset1);
	console.log(dataset2);
	
	//提取svg的宽度长度
	var width = d3.select("#"+svgId).attr("width");
	var height = d3.select("#"+svgId).attr("height");
	//边缘
	var padding = {top:(50), right:(100), bottom:(50), left:(50) };
	
	var lineWidth = height/80;

	var maxCount = d3.max(dataset2[dataset2.length-1], function(d){   
                        return d.y0 + d.y;   
                	}); 
	console.log(maxCount);

	var xScale = d3.scale.linear()
			        .domain([1, 12])
			        .range([0, width - padding.left - padding.right]);
	var yScale = d3.scale.linear()  
                	.domain([0, maxCount])
                	.range([height - padding.bottom - padding.top, 0]);
                
    var color = d3.scale.category10();
    
    var s = d3.select("#"+svgId);
    
    //坐标轴，网格
    s.selectAll("g.axis")
		.remove();
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
	
    //画区域
    var linePath = d3.svg.line()
    	.x(function(d){
            return xScale(d.month) + padding.left;
        })
        .y(function(d){
            return yScale(d.y+d.y0) + padding.top + lineWidth/2;
        });
    var linePath2 = d3.svg.line()
    	.x(function(d){
            return xScale(d.month) + padding.left;
        })
        .y(function(d){
            return yScale(0) + padding.top + lineWidth/2;
        });
    
    var areaPath = d3.svg.area()
    				.x(function(d){
    					return xScale(d.month) + padding.left;
    				})
    				.y0(function(d){
    					 return yScale(d.y0) + padding.top;
    				})
    				.y1(function(d){
    					 return yScale(d.y+d.y0) + padding.top;
    				});
    				
    var areaPath2 = d3.svg.area()
	    			.x(function(d){
	    				return xScale(d.month) + padding.left;
	    			})
	    			.y0(function(d){
	    				 return yScale(0) + padding.top;
	    			})
	    			.y1(function(d){
	    				 return yScale(0) + padding.top;
	    			});
    				
    var groups  = s.selectAll("g.areas");
    var updateG = groups.data(dataset2);
    var enterG  = updateG.enter();
    var exitG   = updateG.exit();
    exitG.remove();
    
    var updateArea = updateG.selectAll("path.area");
	var updateLine = updateG.selectAll("path.line");
	updateLine.attr("d", function(d){
    		return linePathh(d);
    	});
	updateArea.attr("d", function(d){
    		return areaPath(d);
    	})
		.attr("fill",function(d,i){
        	return color(i);
        })
        .attr("opacity", 0.7)
        .on("click", function(d,i){
        	console.log(d);
        	syear = data[i].year;
        	alert(syear);
        	
        	s.selectAll("path.area")
        		.transition()
				.duration(1000)
        		.attr("d",function(d){
        			return areaPath2(d);
        		});
        	s.selectAll("path.line")
        		.transition()
				.duration(1000)
        		.attr("d",function(d){
        			return linePath2(d);
        		})
        		.remove();
        	s.selectAll("text.mark")
        		.transition()
				.duration(1000)
        		.attr("d",function(d){
        			return linePath2(d);
        		})
		        .attr("y", function(d,i) {
		            return yScale(0) + padding.top +height/20;
		        })
		        .attr("fill", "none")
        		.remove();
        		
        	s.append("g")
        		.attr("class","back")
        		.append("rect")
        		.attr("x",width - padding.right/2)//每个矩形的起始x坐标  
		        .attr("y",padding.top)  
		        .attr("width", padding.right*0.4)  
		        .attr("height",padding.right*0.2)//每个矩形的高度  
		        .attr("fill","steelblue")
		        .on("click", function(d){
		        	drawStackedLine(data, svgId, func1, func2);
		        });
		    s.append("g")
		    	.attr("class","back")
				.append("text")
		        .text("back")
		        .attr("transform", "translate(" + (width - padding.right*0.5) + "," + padding.bottom*1.3 + ")")
		        .on("click", function(d){
		        	drawStackedLine(data, svgId, func1, func2);
		        });
        	
        	drawLine(syear, d, svgId, func2);
        	        	
        	func1(syear);
        });
    
    var enterAreas = enterG.append("g")
    						.attr("class", "areas");
    enterAreas.append("path")
   		.attr("class", "area")
    	.attr("d",function(d){
    		return areaPath(d);
    	})
        .attr("fill",function(d,i){
        	return color(i);
        })
        .attr("opacity", 0.7)
        .on("click", function(d,i){
        	console.log(d);
        	syear = data[i].year;
        	alert(syear);
                	
        	s.selectAll("path.area")
        		.transition()
				.duration(1000)
        		.attr("d",function(d){
        			return areaPath2(d);
        		});
        	s.selectAll("path.line")
        		.transition()
				.duration(1000)
        		.attr("d",function(d){
        			return linePath2(d);
        		})
        		.remove();
        	s.selectAll("text.mark")
        		.transition()
				.duration(1000)
        		.attr("d",function(d){
        			return linePath2(d);
        		})
		        .attr("y", function(d,i) {
		            return yScale(0) + padding.top +height/20;
		        })
		        .attr("fill", "none")
        		.remove();
        	
        	
        	//返回键
        	s.append("g")
        		.attr("class","back")
        		.append("rect")
        		.attr("x",width - padding.right/2)//每个矩形的起始x坐标  
		        .attr("y",padding.top)  
		        .attr("width", padding.right*0.4)  
		        .attr("height",padding.right*0.2)//每个矩形的高度  
		        .attr("fill","steelblue")
		        .on("click", function(d){
		        	drawStackedLine(data, svgId, func1, func2);
		        });
		    s.append("g")
		    	.attr("class","back")
				.append("text")
		        .text("back")
		        .attr("transform", "translate(" + (width - padding.right*0.5) + "," + padding.bottom*1.3 + ")")
		        .on("click", function(d){
		        	drawStackedLine(data, svgId, func1, func2);
		        });
        	
        	drawLine(syear, d, svgId, func2);
        	
        	func1(syear);
        	
        });
		
	enterAreas.append("path")
   		.attr("class", "line")
    	.attr("d",function(d){
    		return linePath(d);
    	})
		.attr("stroke", function(d,i){
        	return color(i);
        })
        .attr("stroke-width", lineWidth)
        .attr("fill", "none");
    
    var mark = s.selectAll("text.mark");
    var updateM = mark.data(data);
    var enterM = updateM.enter();
    var exitM = updateM.exit();
    exitM.remove();
    
    updateM.text(function(d){
    		return d.year;
    	})
    	.attr("x", function(d,i){
            return xScale(dataset2[i][dataset2[i].length-1].month) +padding.left;
        })
        .attr("y", function(d,i) {
            return yScale(dataset2[i][dataset2[i].length-1].y+dataset2[i][dataset2[i].length-1].y0) + padding.top +height/20;
        })
        .attr("fill",function(d,i){
        	return color(i);
        });
    
    enterM.append("text")
    	.attr("class", "mark")
    	.text(function(d){
    		return d.year;
    	})
    	.attr("x", function(d,i){
            return xScale(dataset2[i][dataset2[i].length-1].month) +padding.left;
        })
        .attr("y", function(d,i) {
            return yScale(dataset2[i][dataset2[i].length-1].y+dataset2[i][dataset2[i].length-1].y0) + padding.top +height/20;
        })
        .attr("fill",function(d,i){
        	return color(i);
        });
    	
}



////////////////////////////////////
//选择年份的折线图
//////////////////////////////////
function drawLine(syear, d, svgId, func){
//	$("svg#"+svgId).empty();
	var smonth;
	var dataset = [];
	d.forEach(function(d,i){
		dataset.push([d.month, d.count]);
	})
	
	//提取svg的宽度长度
	var width = d3.select("#"+svgId).attr("width");
	var height = d3.select("#"+svgId).attr("height");
	//边缘
	var padding = {top:(50), right:(100), bottom:(50), left:(50) };
	
	var lineWidth = height/80;

	var maxCount = 0;
	var minCount = dataset[0][1];

	dataset.forEach(function(d,i){
		maxCount = Math.max(maxCount, d[1]);
		minCount = Math.min(minCount, d[1]);
	})
	console.log(maxCount);

	var xScale = d3.scale.linear()
			        .domain([1, 12])
			        .range([0, width - padding.left - padding.right]);
	var yScale = d3.scale.linear()  
                	.domain([minCount, maxCount])
                	.range([height - padding.bottom - padding.top, 0]);
                
    var color = d3.scale.category10();
    
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
    
    //画线
    var linePath = d3.svg.line()
    	.x(function(d){
            return xScale(d[0]) + padding.left;
        })
        .y(function(d){
            return yScale(d[1]) + padding.top;
        });
    var linePath2 = d3.svg.line()
    	.x(function(d){
            return xScale(d[0]) + padding.left;
        })
        .y(function(d){
            return yScale(0) + padding.top;
        });
    console.log(linePath(d));
    console.log(linePath2(d));
    
	
	var l = s.selectAll("path.sline");
	var updateL = l.data(dataset);
	var enterL = updateL.enter();
	var exitL  = updateL.exit();
	exitL.remove();
	
	updateL.transition()
		.duration(1000)
        .attr("d",linePath(dataset));
	
	enterL.append("path")
		.attr("class", "sline")
		.attr("d", linePath2(dataset))
		.attr("stroke", d3.rgb(62,82,91))
        .attr("stroke-width", (height/100))
        .attr("fill", "none")
        .transition()
		.duration(1000)
        .attr("d",linePath(dataset));
        
    //画点
    var p = s.selectAll("circle.c");
    var updatePoints = p.data(dataset);
    var enterPoints = updatePoints.enter();
    var exitPoints = updatePoints.exit();
    exitPoints.remove();
    
    updatePoints.attr('cx', function(d) {
            return xScale(d[0])+padding.left;  
        })  
        .attr('cy', function(d) {  
            return yScale(d[1])+padding.top;  
        })
        .attr('r', function(d) {  
            return Math.sqrt(0);  
        })
        .attr("fill", d3.rgb(62,82,91) )
        .on("click", function(d){
			smonth = d[0];
			var str = syear.toString()+","+smonth.toString();
//			alert(str);
			func2(syear,smonth);
		})
        .transition()
		.duration(1000)
		.delay(500)
		.attr('r', function(d) {  
            return Math.sqrt(height/7);  
		});
		
       	
       	enterPoints.append("circle")
	    	.attr("class", "c")
	        .attr('cx', function(d) {  
	            return xScale(d[0])+padding.left;  
	        })  
	        .attr('cy', function(d) {  
	            return yScale(d[1])+padding.top;  
	        })  
	        .attr('r', function(d) {  
	            return Math.sqrt(0);  
	        })
	        .attr("fill", d3.rgb(62,82,91) )
	        .on("click", function(d){
				smonth = d[0];
				var str = syear.toString()+","+smonth.toString();
//				alert(str);
				func2(syear,smonth);
				
			})
	        .transition()
			.duration(1000)
			.delay(500)
			.attr('r', function(d) {  
	            return Math.sqrt(height/7);  
	    	 });
    
    	//文本
    	var t = s.selectAll("text.t");
	    var updateText = t.data(dataset);
	    var entertText = updateText.enter();
	    var exitText = updateText.exit();
	    exitText.remove();
	    
	    updateText.text(d[1])
	        .transition()
	        .duration(1000)
            .delay(500)
            .attr("x", function(d){
                return xScale(d[0]) +padding.left -10;
            })
            .attr("y", function(d) {
                return yScale(d[1]) +padding.top -10;
            })
            .attr("fill", d3.rgb(62,82,91));
        
        entertText.append("text")
        	.attr("class", "t")
        	.text(function(d){
        		return d[1];
        	})
        	.attr("x", function(d){
                return xScale(d[0]) +padding.left -10;
            })
            .attr("y", function(d) {
                return yScale(d[1]) +padding.top -13;
            })
            .attr("fill", "none")
	        .transition()
	        .duration(1000)
            .delay(1400)
            .attr("fill", d3.rgb(62,82,91));
	    
    	
}
