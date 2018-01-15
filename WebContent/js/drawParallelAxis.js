//data.顺序[tq, cljsg, dcsg, rdyyfl, sgxt, xzqh]
//func.暂无

function drawParallelAxis(data, svgId, func){
	
		//提取画布
	var width = d3.select("#"+svgId).attr("width");
	var height = d3.select("#"+svgId).attr("height");
	var padding = {top: 30, right: 10, bottom: 10, left: 30};
	
	//定义维度数据
	var dimensions = [
		{
			"key":"tq",
			"name":"天气",
			"num":0,
			"index":["null",1,19,2,3,4,5,6,7,8,9],
			"description":[],
			"scale":d3.scale.ordinal(),
			"axis":d3.svg.axis().orient("left")	
		},
		{
			"key":"cljsg",
			"name":"车辆间事故",
			"num":1,
			"index":["null",1,2,3,4,5,6,7,8,9],
			"description":[],
			"scale":d3.scale.ordinal(),
			"axis":d3.svg.axis().orient("left")	
		},
		{
			"key":"dcsg",
			"name":"单车事故",
			"num":2,
			"index":["null",11,12,13,14,15,16,17,18,19,20,21,29,31,32,39],
			"description":[],
			"scale":d3.scale.ordinal(),
			"axis":d3.svg.axis().orient("left")	
		},
//		{
//			"key":"rdyyfl",
//			"name":"认定原因",
//			"num":3,
//			"index":["null",11,12,13,14,15,18,19,20,21,22,23,24,25,26,27,28,29,31,32,33,41,49,50,51,52,53,55,56,57,58,59,60,61,62,63,64,69,73,74,75,76,77,78,79,80,81,82,83,89,90,91,92,93,94,95,96,97,98,99],
//			"description":[],
//			"scale":d3.scale.ordinal(),
//			"axis":d3.svg.axis().orient("left")	
//		},
		{
			"key":"sgxt",
			"name":"事故形态",
			"num":4,
			"index":["null",11,12,19,21,22,23,29,31,32,33,34,35,36,37,38,39],
			"description":[],
			"scale":d3.scale.ordinal(),
			"axis":d3.svg.axis().orient("left")	
		},
		{
			"key":"xzqh",
			"name":"行政区划",
			"num":5,
			"index":["null",340101,340102,340103,340104,340111,340121,340122,340123,340124,340125,340190],
			"description":[],
			"scale":d3.scale.ordinal(),
			"axis":d3.svg.axis().orient("left")	
		}
	];
	
	dimensions.forEach(function(d,i){
		dimensions[i].scale.domain(d.index)
						.rangePoints([height - padding.bottom - padding.top, 0]);
//		dimensions[i].axis.scale(d.scale)
//						.tick(d.index.lenght);
	});
	
	//属性名
	var a = []; 
	//x轴
	var xScale = d3.scale.linear()
				.domain([0,dimensions.length])
				.range([0, width - padding.right - padding.left]);
	//y轴们
	var yScales = [];
	dimensions.forEach(function(d,i){
		yScales[i]=d.scale;
		a.push(d.name);
	})
	console.log(a);
	
	//数据
	var dataset = [];
	data.forEach(function(d,i){
		var b = [];
		d.forEach(function(d,i){
			b.push(yScales[i](d));
		})
		dataset.push(b);
	});
	console.log(dataset);
	
	$("svg#"+svgId).empty();
	//绑定画布
	var s = d3.select("#"+svgId);
	
	s.selectAll("g")
		.remove;
	

	
	var dragging = {};
	
	var line = d3.svg.line();
	var axis = d3.svg.axis().orient("left");
//	var background;
//	var foreground;
	
	
	var linePath =d3.svg.line()
        .x(function(d,i){
            return xScale(i) + padding.left;
        })
        .y(function(d,i){
            return d + padding.top;
        }); 
	
	var background = s.append("g")
		.attr("class", "background")
		.selectAll("path")
		.data(dataset)
		.enter()
		.append("path")
		.attr("d", function(d){
    		return linePath(d);
    	});
    	
    var foreground = s.append("g")
	    .attr("class", "foreground")
	    .selectAll("path")
	    .data(dataset)
	    .enter()
	    .append("path")
	    .attr("d", function(d){
    		return linePath(d);
    	});


	
	var g = s.selectAll(".dimension")
				.data(a)
				.enter()
				.append("g")
				.attr("class", "dimension")
				.attr("transform", function(d,i) { 
					return "translate(" + (xScale(i)+padding.left)  + ","+ padding.top + ")"; 
				});

		
	g.append("g")
		.attr("class", "axis")
		.each(function(d,i){ 
			d3.select(this)
				.call(axis.scale(yScales[i])); 
		})
		.append("text")
		.style("text-anchor", "middle")
		.attr("y", -9)
		.text(function(d,i){ 
			return d; 
		});
	
	g.append("g")
		.attr("class", "brush")
		.each(function(d,i) {
        	d3.select(this)
        		.call(yScales[i].brush = d3.svg.brush()
        			.y(yScales[i])
        			.on("brushstart", brushstart)
        			.on("brush", brush));
		})
		.selectAll("rect")
		.attr("x", -8)
		.attr("width", 16);
	

	
	function brushstart() {
		d3.event.sourceEvent.stopPropagation();
	}
	
	function brush(){
		var actives = a.filter(function(d,i) { 
			return !yScales[i].brush.empty(); 
		});
		var extents = actives.map(function(d,i) { 
			return yScales[i].brush.extent(); 
		});
		
		foreground.style("display", function(d) {
		    return actives.every(function(p, i) {
		    	return extents[i][0] <= d[i] && d[i] <= extents[i][1];
		    }) ? null : "none";
		});
	}
}
