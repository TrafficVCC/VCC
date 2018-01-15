function drawPoints(data, svgId, func){
	//预定data是一个1000个元素的数组
	
	//提取svg的宽度长度
	var width = d3.select("#"+svgId).attr("width");
	var height = d3.select("#"+svgId).attr("height");
	//边缘
	var padding = {top:(50), right:(50), bottom:(50), left:(50) };
	
	var num = data.length;		//1000
	var ymax = d3.max(data);
	var diameter = (width-padding.left-padding.right)/num;
	
	var xScale = d3.scale.linear()
        .domain([0, num])
        .range([0, width - padding.left - padding.right]);
        
    var yScale = d3.scale.linear()
        .domain([0, ymax])
        .range([height - padding.top - padding.bottom, 0]);
        
    
	var s = d3.select("#"+svgId);
	
	//画横纵坐标
	s.selectAll("g")
		.remove();
		
    var x_axis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(3);
    var y_axis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(3);
    
	s.append("g")
		.attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
        .call(x_axis);
        
	s.append("g")
		.attr("class", "axis")
		.attr("transform", "translate("+ padding.left +"," + padding.top + ")")
		.call(y_axis);
		
	//横纵坐标标注
//	s.append("g")
//  	.append("text")
//      .text("月份")
//      .attr("transform", "translate(" + (width-padding.right/1.5) + "," + (height - padding.bottom) + ")");
//	s.append("g")
//		.append("text")
//      .text("事故数量")
//      .attr("transform", "translate(" + 0 + "," +  padding.bottom/2 + ")");

	//画点
	var p = s.selectAll("circle");
    var updatePoints = p.data(data);
    var enterPoints = updatePoints.enter();
    var exitPoints = updatePoints.exit();
    
    updatePoints.attr("id", function(d,i){
    		return "num"+d.toString();
    	})
    	.attr('cx', function(d,i) {  
            return xScale(i)+padding.left;  
        })  
        .attr('cy', function(d) {  
            return yScale(d)+padding.bottom;  
        })  
        .attr('r', function(d) {  
            return Math.sqrt(diameter);  
        })
        .attr("fill", d3.rgb(62,82,91) )
        .on("click", function(d,i){
        	func;
        });
    
    enterPoints.append("circle")
    	.attr("id", function(d,i){
    		return "num"+d.toString();
    	})
    	.attr('cx', function(d,i) {  
            return xScale(i)+padding.left;  
        })  
        .attr('cy', function(d) {  
            return yScale(d)+padding.top;  
        })  
        .attr('r', function(d) {  
            return Math.sqrt(diameter);  
        })
        .attr("fill", d3.rgb(62,82,91) )
        .on("click", function(d,i){
        	func;
        });



}
