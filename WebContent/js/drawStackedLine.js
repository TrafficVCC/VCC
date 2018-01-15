//堆积折线图，点击区域转为单线的折线图。

//data 结构为[{"year":d, "count":[d]}, …… ].
//func1 点击堆积图会调用的函数，func1(d):d是syear 选择年份。
//func2 点击折线图
//涉及全局变量，window.yflags, window.years

function drawStackedLine(data, svgId, func){
//	$("svg#"+svgId).empty();
	var yFlags =[];
	yFlags = window.yflags;
	var arrayYear =[];
	arrayYear = window.years;
	var syear = [];
	var soneyear = [];
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
//	console.log(dataset1);
	console.log(yFlags);
	var stack = d3.layout.stack()
					.values(function(d){ return d; })  
                    .x(function(d){ return d.month; })  
                    .y(function(d){ return d.count; });  
	var dataset2 = stack(dataset1);
//	console.log(dataset2);
	
	//提取svg的宽度长度
	var width = d3.select("#"+svgId).attr("width");
	var height = d3.select("#"+svgId).attr("height");
	//边缘
	var padding = {top:(50), right:(50), bottom:(50), left:(50) };
	
	var lineWidth = height/100;

	var maxCount = d3.max(dataset2[dataset2.length-1], function(d){   
                        return d.y0 + d.y;   
                	}); 
//	console.log(maxCount);

	var xScale = d3.scale.linear()
			        .domain([1, 12])
			        .range([0, width - padding.left - padding.right]);
	var yScale = d3.scale.linear()  
                	.domain([0, maxCount])
                	.range([height - padding.bottom - padding.top, 0]);
                
    var color = d3.scale.category10();
    
    var s = d3.select("#"+svgId);
    
    s.append("text")
    	.attr("id", "title")
    	.text("事故发生数量统计图")
		.style("text-anchor", "middle")
		.style("font-size","18px")
	    .attr("x", width/2)
	    .attr("y", padding.top/2);
    
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
    				
    s.selectAll("g.areas")
    	.remove();
    	
    var groups  = s.selectAll("g.areas");
    var updateG = groups.data(dataset2);
    var enterG  = updateG.enter();
    var exitG   = updateG.exit();
    exitG.remove();
    
    
    var updateArea = updateG.selectAll("path.area");
	var updateLine = updateG.selectAll("path.line");
	updateLine.attr("d", function(d){
    		return linePath(d);
    	});
	updateArea.attr("d", function(d){
    		return areaPath(d);
    	})
		.attr("fill",function(d,i){
        	return color(i);
        })
        .attr("opacity", function(d,i){
        	if(yFlags[i])
        		return 1.0;
        	else
        		return 0.5;
        })
        .on("click", function(d,i){
        	soneyear = data[i].year.toString();
        	syear = [];
        	
        		s.selectAll("path.area")
        			.attr("opacity", 0.5);
        		d3.select(this)
        			.attr("opacity", 1.0);
        		syear.push(soneyear);
        	
        	
        	window.years = syear;
        	alert("选择"+syear);
        	func();
        	
//			yFlags[i] = (yFlags[i]+1)%2;
//      	console.log(yFlags);

//        	syear = [];
//        	yFlags.forEach(function(d,i){
//        		if(d){
//        			syear.push(data[i].year.toString());
//        		}
//        	});
////      	console.log(syear);
//        	window.years = syear;
//        	
//        	if(yFlags[i]){
//        		d3.select(this)
//        			.attr("opacity", 1.0);
//        	}
//        	else{
//        		d3.select(this)
//        			.attr("opacity", 0.5);
//        	}
        	
        	
        	

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
        .attr("opacity", function(d,i){
        	if(yFlags[i])
        		return 1.0;
        	else
        		return 0.5;
        })
        .on("click", function(d,i){
        	soneyear = data[i].year.toString();
        	syear = [];
        	
        	
        	s.selectAll("path.area")
        		.attr("opacity", 0.5);
        	d3.select(this)
        		.attr("opacity", 1.0);
        	syear.push(soneyear);
       
        	
        	func(syear);
        	
        	
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
//选择单个年份的折线图(现在不用了)
//////////////////////////////////
function drawLine(syear, d, svgId, func){
    	
}
