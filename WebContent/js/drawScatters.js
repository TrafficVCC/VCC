//data:关于某条道路上发生事件和事件发生间隔的数据集。
//结构为:[{"no":xx, "span":xx},……]
//svgId:画布id。
//func:点击散点能触发的函数。
//func(d). d[0]:事件, d[1]:与上此发生事件间隔时间。

function drawScatters(data, svgId, func){
	var dataset = [];
	data.forEach(function(d){
		dataset.push([d.no,d.span]);
	});
	console.log(dataset);
	
	var width = d3.select("#"+svgId).attr("width");
	var height = d3.select("#"+svgId).attr("height");
	var padding = {top:(30), right:(50), bottom:(30), left:(50) };

	//求y向数据最大值，以确定y向比例尺
	var ymax = 0;
	dataset.forEach(function(d){
		ymax = Math.max(ymax, d[1]);
	})
	var xScale = d3.scale.linear()//time.scale()
        .domain([dataset[0][0], dataset[dataset.length-1][0]]);
    var yScale = d3.scale.linear()
		.domain([0, ymax])
    xScale.range([0, width - padding.left - padding.right]);
    yScale.range([height - padding.top - padding.bottom, 0]);
    
    //选定画布
	var s = d3.select("#"+svgId);
    
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
		.attr("class", "xaxis")
        .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
        .call(x_axis);
	s.append("g")
		.attr("class", "yaxis")
		.attr("transform", "translate("+ padding.left +"," + padding.top + ")")
		.call(y_axis);
		
	//画点
	var p = s.selectAll("circle");
    var updatePoints = p.data(dataset);
    var enterPoints = updatePoints.enter();
    var exitPoints = updatePoints.exit();
	exitPoints.remove();
    
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

}
