//道路列表
//全局变量，window.roads

//道路列表

function writeRoadList(data, svgId, func){
	var dataset = [];
	data.forEach(function(d, i){
		dataset.push([d.lh, d.count]);
	});
	var lcount = dataset.length;
	
	//提取svg的宽度长度
	var width = d3.select("#"+svgId).attr("width");
	var height = d3.select("#"+svgId).attr("height");
	//边缘
	var padding = {top:(50), right:(100), bottom:(50), left:(50) };
	
	//长宽
	var rectWidth = (width-padding.left-padding.right)/2;
	var rectHeight = (height-padding.top-padding.bottom)/5
//	var rectWidth = 200;
//	var rectHeight = 50;
	
	var s = d3.select("#"+svgId);
	
	var rects = s.selectAll("rect");
	var updataRect = rects.data(dataset);
	var enterRect = updataRect.enter();
	var exitRect = updataRect.exit();
	exitRect.remove();
	
	updataRect.attr("id", function(d,i){
			return "r"+d[0].toString();
		})
		.attr("x", function(d,i){
			return padding.left+(parseInt(i/5))*rectWidth;
		})
		.attr("y", function(d, i){
			return padding.top+(i%5)*rectHeight;
		})
		.attr("width", rectWidth)
		.attr("height", rectHeight)
		.attr("fill", function(){
			if(lcount==1)
				return "#ccc";
			else
				return "#fff";
		})
//		.attr("fill","#fff")
		.attr("stroke", "#ccc")
		.on("click", function(d,i){
			s.selectAll("rect")
        		.attr("fill","#fff");
        	d3.select(this)
        		.attr("fill","#ccc");
        		
//			var tid = "#t"+d[0].toString();
//        	s.selectAll("text")
//        		.attr("fill","#ccc");
//        	s.select(tid)
//        		.attr("fill","black");
        	
			window.roads = d[0].toString();
        	
        	func(d[0]);
		});
	
	enterRect.append("rect")
		.attr("id", function(d,i){
			return "r"+d[0].toString();
		})
		.attr("x", function(d,i){
			return padding.left+(parseInt(i/5))*rectWidth;
		})
		.attr("y", function(d, i){
			return padding.top+(i%5)*rectHeight;
		})
		.attr("width", rectWidth)
		.attr("height", rectHeight)
		.attr("fill", function(){
			if(lcount==1)
				return "#ccc";
			else
				return "#fff";
		})
//		.attr("fill","#fff")
		.attr("stroke", "#ccc")
		.on("click", function(d,i){
        	s.selectAll("rect")
        		.attr("fill","#fff");
        	d3.select(this)
        		.attr("fill","#ccc");
        		
//			var tid = "#t"+d[0].toString();
//        	s.selectAll("text")
//        		.attr("fill","#ccc");
//        	s.select(tid)
//        		.attr("fill","black");
        	
			window.roads = d[0].toString();
        	        	
        	func(d[0]);
		});
	
	
	var texts = s.selectAll("text");
	var updateText = texts.data(dataset);
	var enterText = updateText.enter();
	var exitText = updateText.exit();
	exitText.remove();
	
	updateText.attr("id", function(d,i){
			return "t"+d[0].toString();
		})
		.attr("class", "road")
		.text(function(d,i){
			return d[0]+"------("+d[1]+")";
		})
		.style("text-anchor", "middle")
		.attr("x", function(d,i){
			return padding.left+(parseInt(i/5)+0.5)*rectWidth;
		})
		.attr("y", function(d, i){
			return padding.top+(i%5+0.5)*rectHeight;
		})
//		.attr("fill", function(){
//			if(lcount==1)
//				return "#000";
//			else
//				return "#ccc";
//		})
		.attr("fill", "#000")
        .on("click", function(d,i){
        	
        	var rid = "#r"+d[0].toString();
        	s.selectAll("rect")
        		.attr("fill","none");
        	s.select(rid)
        		.attr("fill","#ccc");

//        	s.selectAll("text")
//        		.attr("fill","#ccc");
//        	d3.select(this)
//        		.attr("fill","#000");
        		
        	window.roads = d[0].toString();
			
			func(d[0]);

		});
	
	enterText.append("text")
		.attr("id", function(d,i){
			return "t"+d[0].toString();
		})
		.attr("class", "road")
		.text(function(d,i){
			return d[0]+"------("+d[1]+")";
		})
		.style("text-anchor", "middle")
		.attr("x", function(d,i){
			return padding.left+(parseInt(i/5)+0.5)*rectWidth;
		})
		.attr("y", function(d, i){
			return padding.top+(i%5+0.5)*rectHeight;
		})
//		.attr("fill", function(){
//			if(lcount==1)
//				return "#000";
//			else
//				return "#ccc";
//		})
      .attr("fill", "#000")
        .on("click", function(d,i){
        	
        	var rid = "#r"+d[0].toString();
        	s.selectAll("rect")
        		.attr("fill","none");
        	s.select(rid)
        		.attr("fill","#ccc");

//        	s.selectAll("text")
//        		.attr("fill","#ccc");
//        	d3.select(this)
//        		.attr("fill","#000");
			
        	window.roads = d[0].toString();
        	
			func(d[0]);
	
		});
	
}
