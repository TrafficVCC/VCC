//data：一个数组。许多二维数组的集合。
//结构为[{"year":d, "count":[d]}, …… ].
//svgId：字符串。画图位置所在的svg的id。
//func：函数名。点击折线点能触发的函数。
//func(d),d[0]:年份,d[1]:事故数量。

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
	var padding = {top:(50), right:(50), bottom:(50), left:(50) };

	//求y向数据最大值，以确定y向比例尺
	var ymax = 0;
	dataset.forEach(function(d){
		ymax = Math.max(ymax, d[1]);
	})
	
	//横纵坐标的比例尺
	var xScale = d3.scale.linear()//time.scale()
        .domain([dataset[0][0], dataset[dataset.length-1][0]]);
    var yScale = d3.scale.linear()
		.domain([0, ymax]);
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
        
	var l = s.selectAll("path.line");
    var updateLines = l.data(dataset);
    var enterLines = updateLines.enter();
    var exitLines = updateLines.exit();
    
    updateLines.attr("d",linePath(dataset))
        .attr("stroke", d3.rgb(62,82,91))
        .attr("stroke-width", (height/100))
        .attr("fill", "none");
        
	enterLines.append("path")
		.attr("class", "line")
        .attr("d",linePath(dataset))
        .attr("stroke", d3.rgb(62,82,91))
        .attr("stroke-width", height/100)
        .attr("fill", "none");
        
    exitLines.remove();
  
  	//画横纵坐标
	s.selectAll("g")
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
		.attr("class", "xaxis")
        .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
        .call(x_axis);
    s.append("g")
    	.append("text")
        .text("年份")
        .attr("transform", "translate(" + (width-padding.right/1.5) + "," + (height - padding.bottom) + ")");
        
	s.append("g")
		.attr("class", "yaxis")
		.attr("transform", "translate("+ padding.left +"," + padding.top + ")")
		.call(y_axis);
	s.append("g")
		.append("text")
        .text("事故数量")
        .attr("transform", "translate(" + 0 + "," +  padding.bottom/2 + ")");
        

                   
	//画点
	var p = s.selectAll("circle");
    var updatePoints = p.data(dataset);
    var enterPoints = updatePoints.enter();
    var exitPoints = updatePoints.exit();
    
    updatePoints.attr("id", function(d){
            return d[0];
        })
    	.attr("class","c")
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
        	s.select("#sc")
        		.remove();
        	s.select("#st")
        		.remove();
        	s.append("circle")
        		.attr("id","sc")
        		.attr("fill", d3.rgb(62,82,91))
        		.attr('cx', xScale(d[0])+padding.left)  
		        .attr('cy', yScale(d[1])+padding.top)  
		        .attr('r', Math.sqrt(height/4));
		    s.append("text")
	            .attr("id", "st")
	            .text(d[1])
	            .transition()
	            .duration(500)
	            .attr("x", function(){
	                return xScale(d[0]) +padding.left -10;
	            })
	            .attr("y", function() {
	                return yScale(d[1]) +padding.top -10;
	            })
	            .attr("fill", d3.rgb(62,82,91));
        	
        	func(d);
        })
        .on("mouseover", function(d){
//	        d3.select(this)
//	            .transition()
//	            .duration(300)
//	            .attr('r',  function(d) {  
//	                return Math.sqrt(height/4);  
//	            });
	    
	        s.append("text")
	            .attr("id", "text")
	            .text(d[1])
	            .attr("x", function(){
	                return xScale(d[0]) +padding.left -10;
	            })
	            .attr("y", function() {
	                return yScale(d[1]) +padding.top -10;
	            })
	            .attr("fill", d3.rgb(62,82,91));

        })
        .on("mouseout", function(d){
//      	d3.select(this)
//      		.attr('r', function(d) {  
//		            return Math.sqrt(height/7);  
//		        });
	        d3.select("#text")
	            .remove();
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
        	s.select("#sc")
        		.remove();
        	s.select("#st")
        		.remove();
        	s.append("circle")
        		.attr("id","sc")
        		.attr("fill", d3.rgb(62,82,91))
        		.attr('cx', xScale(d[0])+padding.left)  
		        .attr('cy', yScale(d[1])+padding.top)  
		        .attr('r', Math.sqrt(height/4));
		    s.append("text")
	            .attr("id", "st")
	            .text(d[1])
	            .transition()
	            .duration(500)
	            .attr("x", function(){
	                return xScale(d[0]) +padding.left -10;
	            })
	            .attr("y", function() {
	                return yScale(d[1]) +padding.top -10;
	            })
	            .attr("fill", d3.rgb(62,82,91));
	            
        	func(d);
        })
        .on("mouseover", function(d){
//	        d3.select(this)
//	            .transition()
//	            .ease('bounce')
//	            .duration(300)
//	            .attr('r',  function(d) {  
//	                return Math.sqrt(height/4);  
//	            });
	    
	        s.append("text")
	            .attr("id", "text")
	            .text(d[1])
	            .transition()
	            .duration(500)
	            .attr("x", function(){
	                return xScale(d[0]) +padding.left -10;
	            })
	            .attr("y", function() {
	                return yScale(d[1]) +padding.top -10;
	            })
	            .attr("fill", d3.rgb(62,82,91));

        })
        .on("mouseout", function(d){
//      	d3.select(this)
//      		.attr('r', function(d) {  
//		            return Math.sqrt(height/7);  
//		        });
	        d3.select("#text")
	            .remove();
        });
    
	exitPoints.remove();
	

		    


}
