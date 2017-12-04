//data.顺序[tq, cljsg, dcsg, rdyyfl, sgxt, xzqh]
//func.暂无

function drawParallelAxis(data, svgId, func){
	
	//提取svg的宽度长度
	var width = d3.select("#"+svgId).attr("width");
	var height = d3.select("#"+svgId).attr("height");
	//	alert(width, height);
	//边缘
	var padding = {top:(60), right:(50), bottom:(50), left:(50) };
	
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
	
	var dataset = [];
	data.forEach(function(d){
		var a = [];
		d.forEach(function(d,i){
//			a.push({"x":i, "y":dimensions[i].scale(d)});
			a.push([i, dimensions[i].scale(d)]);
		})
		dataset.push(a);
	});
	console.log(dataset);
	
	//
	var s = d3.select("#"+svgId);
	
	var xScale = d3.scale.linear()
					.domain([0,dimensions.length])
					.range([0, width - padding.right - padding.left]);
	
	s.selectAll("g.axis").remove();
	//画维度的比例线
	dimensions.forEach(function(d,i){
		var axis = d3.svg.axis()
						.scale(d.scale)
	                    .orient("right")
	                    .ticks(5);
	    s.append("g")
	    	.attr("class", "axis")
	    	.attr("transform", "translate("+ (padding.left+xScale(i)) +"," + padding.top + ")")
			.call(axis);
		s.append("text")
			.attr("class", "label")
			.attr("transform", "translate("+ (padding.left+xScale(i)) +"," + padding.top/2 + ")")
			.text(d.name);

	})
	

	
	
	//数据折线
	var linePath =d3.svg.line()
        .x(function(d){
            return xScale(d[0]) + padding.left;
        })
        .y(function(d){
            return d[1] + padding.top;
        });   
    
    var gLine = s.selectAll("g.lines");
    var updateGLine = gLine.data(dataset);
    var enterGLine = updateGLine.enter();
    var exitGLine = updateGLine.exit();
    exitGLine.remove();
    
    var updateL = updateGLine.selectAll("path.line");
    updateL.attr("d", function(d){
    		return linePath(d);
    	});
    
    var enterL = enterGLine.append("g")
    						.attr("class", "lines");
    enterL.append("path")
   		.attr("class", "line")
    	.attr("d",function(d){
    		console.log(linePath(d));
    		return linePath(d);
    	})
		.attr("stroke", d3.rgb(62,82,91))
        .attr("stroke-width", 2)
        .attr("fill", "none");
}
