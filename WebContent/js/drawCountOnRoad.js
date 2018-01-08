//data: [{"jdwz":……, "count":……}，……]

function drawCountOnRoad(data, svgId, func){
	
	var dataset = [];
	data.forEach(function(d,i){
		dataset.push([d.jdwz, d.count]);
	});
	
	var width = d3.select("#"+svgId).attr("width");
	var height = d3.select("#"+svgId).attr("height");
	var padding = {top:(50), right:(50), bottom:(50), left:(50) };
	
	var xmax = dataset[0][0];
	var ymax = 0;
	dataset.forEach(function(d,i){
		xmax = Math.max(xmax, d[0]);
		ymax = Math.max(ymax, d[1]);
	});

	var lineWidth = (width - padding.left - padding.right)/(xmax);
	var roadHeight = (height - padding.bottom - padding.top)/20;
	
	var xScale = d3.scale.linear()
			        .domain([0, xmax])
			        .range([0, width - padding.left - padding.right]);
	var yScale = d3.scale.linear()  
                	.domain([0, ymax])
                	.range([height - padding.bottom - padding.top - roadHeight, 0]);
                	
    var linePath = d3.svg.line()
    	.x(function(d){
            return xScale(d[0]) + padding.left;
        })
        .y(function(d){
            return yScale(d[1]) + padding.bottom + roadHeight;
        });
                	
    var s = d3.select("#"+svgId);
//    $("svg#"+svgId).empty();
    
    s.selectAll("rect")
    	.remove();
    s.selectAll("path.lines")
    	.remove();
    //画一个线作为抽象的道路
    s.append("rect")
    	.attr("id", "road")
    	.attr("x", padding.left)
    	.attr("y", height - padding.bottom)
    	.attr("width", width - padding.left - padding.right )
    	.attr("height", roadHeight)
    	.attr("fill", "#ccc");
    	
	var lines = s.selectAll("path.lines");
	var updateLines = lines.data(dataset);
	var enterLines = updateLines.enter();
	var exitLines = updateLines.exit();
	exitLines.remove();
	
	updateLines.attr("d", function(d){
			var a = [[d[0],0], [d[0], d[1]]];
			return linePath(a);
		})
		.attr("stroke", "#000")
//      .attr("stroke-width", lineWidth)
        .attr("fill", "none");
	
	enterLines.append("path")
		.attr("class", "lines")
		.attr("d", function(d){
			var a = [[d[0],0], [d[0], d[1]]];
			return linePath(a);
		})
		.attr("stroke", "#000")
//      .attr("stroke-width", lineWidth)
        .attr("fill", "none");
	
}
