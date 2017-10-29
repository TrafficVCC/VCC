//data：一个数组。许多二维数组的集合。结构为[{"year":d, "count":[d]}, {…, …}, …… ].
//svgId：字符串。画图位置所在的svg的id。
//func：函数名。点击折线点能触发的函数。

//画年代折线图
function drawLineByYear(data, svgId, func){
	//整理数据格式
	var dataset = [];
	data.forEach(function(d){
		dataset.push([d.year, d.count[0]]);
	});
	//提取svg的宽度长度
	var width = d3.select("#"+svgId).attr("width");
	var height = d3.select("#"+svgId).attr("height");
	//	alert(width, height);
	//边缘
	var padding = {top:(30), right:(50), bottom:(30), left:(50) };

	//求y向数据最大值，以确定y向比例尺
	var ymax = 0;
	dataset.forEach(function(d){
		ymax = Math.max(ymax, d[1]);
	})
	
	//横纵坐标的比例尺
	var xScale = d3.scale.linear()//time.scale()
        .domain([dataset[0][0], dataset[dataset.length-1][0]]);
    var yScale = d3.scale.linear()
		.domain([0, ymax])
    xScale.range([0, width - padding.left - padding.right]);
    yScale.range([height - padding.top - padding.bottom, 0]);
	
	//选定画布
	var s = d3.select("#"+svgId);

	//画线
	var linePath =d3.svg.line()
        .x(function(d){
            return xScale(d[0]) + padding.left;
        })
        .y(function(d){
            return yScale(d[1]) + padding.top;
        });
        
	var l = s.selectAll("path");
    var updateLines = l.data(dataset);
    var enterLines = updateLines.enter();
    var exitLines = updateLines.exit();
    
    updateLines.attr("d",linePath(dataset))
        .attr("stroke", d3.rgb(62,82,91))
        .attr("stroke-width", (height/100))
        .attr("fill", "none");
        
	enterLines.append("path")
        .attr("d",linePath(dataset))
        .attr("stroke", d3.rgb(62,82,91))
        .attr("stroke-width", height/70)
        .attr("fill", "none");
        
    exitLines.remove();
  
                   
	//画点
	var p = s.selectAll("circle");
    var updatePoints = p.data(dataset);
    var enterPoints = updatePoints.enter();
    var exitPoints = updatePoints.exit();
    
    updatePoints.attr("id", function(d){
            return d[0];
        })
        .attr('cx', function(d) {  
            return xScale(d[0])+padding.left;  
        })  
        .attr('cy', function(d) {  
            return yScale(d[1])+padding.top;  
        })  
        .attr('r', function(d) {  
            return Math.sqrt(height/7);  
        })
        .attr("fill", d3.rgb(62,82,91) )
        .on("click",function(d){
        	func(d)
        });
            
    enterPoints.append("circle")
    	.attr("id", function(d){
            return d[0];
        })
        .attr('cx', function(d) {  
            return xScale(d[0])+padding.left;  
        })  
        .attr('cy', function(d) {  
            return yScale(d[1])+padding.top;  
        })  
        .attr('r', function(d) {  
            return Math.sqrt(height/7);  
        })
        .attr("fill", d3.rgb(62,82,91) )
        .on("click",function(d){
        	func(d)
        });
        
	exitPoints.remove();
		    
    //画横纵坐标
	 s.selectAll("g.xaxis")
		.remove();
		
    var x_axis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(dataset.length-1);
    var y_axis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(3);
    
	s.append("g")
		.attr("class", "xaxis")  //设定坐标轴样式
        .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
        .call(x_axis);
//      .append("text") //添加坐标轴说明  
//      .text("年份")  
//      .attr("transform","translate("+(padding.bottom)+","+0 +")");
	s.append("g")
		.attr("class", "yaxis")
		.attr("transform", "translate("+ padding.left +"," + padding.top + ")")
		.call(y_axis);

    

	

}
