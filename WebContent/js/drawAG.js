//属性图
//全局变量：window.attrs, window.attrFlag

function drawAG(data2, svgId, func){
	
	//提取svg的宽度长度
	var width = d3.select("#"+svgId).attr("width");
	var height = d3.select("#"+svgId).attr("height");
	//边缘
	var padding = {top:(90), right:(50), bottom:(50), left:(50) };
	
	//获取要展示的属性
	var xContent = window.attrs;
	var attrsChinese = [];
	var contentChinese = [];
	
	//整理当前标志
	var aFlag = window.attrFlag;
	var flags = [];
	aFlag.forEach(function(d,i){
		var c = xContent[i];
		var t = d.split("/");
		flags[c] = t;
		
	})
	console.log(flags);
	
	//属性块长宽的定义
	var rectWidth = (width-padding.left-padding.right)/(xContent.length-1)/15;
	var rectHeights = [];
	var rectHeightScales = [];
	var linew= 1.5;

	//获取属性的相关数据
	var dimensions = [];
	dimensions = getDimensions(xContent);
//	console.log(dimensions);
	
		//xy方向的比例尺函数定义
	var xScale = d3.scale.ordinal()
			        .domain(xContent)
			        .rangePoints([0, width - padding.left - padding.right]);
	var yScales = [];
	
	dimensions.forEach(function(d,i){
		
		attrsChinese[i] = d.name;
		contentChinese[d.key] = d.description;
		
		rectHeights[d.key] = (height - padding.bottom - padding.top)/(d.index.length*3);

		dimensions[i].scale.domain(d.index)
						.rangePoints([height - padding.bottom - padding.top, 0]);
		yScales[d.key]=d.scale;
	})
	
	//颜色
	var color1 = d3.rgb("#B0E2FF");  //浅蓝色  
	var color2 = d3.rgb("#6CA6CD");    //蓝色  
	var computeColor = d3.interpolate(color1,color2);  
	
	
	//data1,属性块； data2，属性线
	var dataset1 = [];
	dataset1 = getAttrCount(data2);
	xContent.forEach(function(d,i){
		var dataset = [];
		dataset = dataset1[d];
		max = d3.max(dataset, function(d){	return d[1]});
		min = d3.min(dataset, function(d){	return d[1]});
		rectHeightScales[d] =  d3.scale.linear()
    								.domain([0, max])        
    								.range([0, rectHeights[d]]);   
	})
	
	
	var dataset2 = [];
	data2.forEach(function(d,i){
		var lstart = xContent[i];
		var lend = xContent[i+1];
		
		
		var attrcotent = [];
		d.forEach(function(d,i){
			var a1 = getContent(d, lstart);
			var a2 = getContent(d, lend);
			attrcotent.push([a1, a2, d.count]);
		})
		
		dataset2.push(attrcotent);
		
	})

	var s = d3.select("#"+svgId);
	$("#"+svgId).empty();
	
	//title
	s.append("text")
		.attr("id", "title")
		.text("关于事故属性的平行坐标图")
		.style("text-anchor", "middle")
		.style("font-size","18px")
	    .attr("x", width/2)
	    .attr("y", padding.top/4);
	    
	
	//标签
	var labels = s.selectAll(".label");
	var updateLabels = labels.data(xContent);
	var enterLabels = updateLabels.enter();
	var exitLabels = updateLabels.exit();
	exitLabels.remove();
	
	updateLabels.attr("class", "label")
		.style("text-anchor", "middle")
		.style("font-size","15px")
		.attr("x", function(d,i){
			return xScale(d)+padding.left+rectWidth/2;
		})
		.attr("y", padding.top/2+rectWidth)
		.text(function(d,i){
			return attrsChinese[i];
		})
		.on("click", function(d,i){
		
			window.attrFlag[i] = "0";
			console.log(window.attrFlag);
			
			func();
				
		});
	
	enterLabels.append("text")
		.attr("class", "label")
		.style("text-anchor", "middle")
		.style("font-size","15px")
	    .attr("x", function(d,i){
	    	return xScale(d)+padding.left+rectWidth/2;
	    })
	    .attr("y", padding.top/2+rectWidth)
	    .text(function(d,i){
	    	return attrsChinese[i];
	    })
	    .on("click", function(d,i){
	    	
	    	
	    	window.attrFlag[i] = "0";
	    	console.log(window.attrFlag);
	    	
	    	func();
	    		
	    });
	    
	
	//属性线
	var linepath = d3.svg.line()
	    	.x(function(d){
	            return d[0] + padding.left + rectWidth/2 ;
	        })
	        .y(function(d){
	            return d[1] + padding.top  ;
	        });
	
	var attrLines = [];
	var attrLinesUpdate = [];
	var attrLinesEnter = [];
	var attrLinesExit = [];
	dataset2.forEach(function(d,i){
		
		var lContent = d;
		
		var lstart = xContent[i];
		var lend = xContent[i+1];
		
//		var countData = dataset1[lstart];
//		console.log(countData);
//		var rectHScale = rectHeightScales[lstart];
		var y0 = rectHeights[lstart];
		var y1 = rectHeights[lend];
		var rectH = Math.min(y0,y1);
//		var countMax = d3.max(countData, function(d){	return d[1];});
//		var lineScale = d3.scale.linear()
//    								.domain([0, countMax])        
//    								.range([0, rectH/2]);  
		var countMin = d3.min(lContent, function(d){	return d[2];});
		var countMax = d3.max(lContent, function(d){	return d[2];});
		var colorLinear = d3.scale.linear()  
			                .domain([countMin, countMax])  
			                .range([0, 1]);  
		
		
		attrLines[lstart] = s.selectAll("line.l"+lstart);
		attrLinesUpdate[lstart] = attrLines[lstart].data(lContent);
		attrLinesEnter[lstart] = attrLinesUpdate[lstart].enter();
		attrLinesExit[lstart] = attrLinesUpdate[lstart].exit();
		attrLinesExit[lstart].remove();
		
		attrLinesUpdate[lstart].attr("d", function(d){
					//数据转换			
					var a = [	
								[xScale(lstart), yScales[lstart](d[0])],
								[xScale(lend), yScales[lend](d[1])]
							];
					return linepath(a);

				})
//				.attr("stroke", "#6CA6CD")
				.attr("stroke", function(d,i){
					return computeColor(colorLinear(d[2]));
				})
		      	.attr("stroke-width", function(d,i){
		      		return linew;
		      	})
		        .attr("fill", "none")
		        .attr("onclick", function(d,i){

		        });
		
		attrLinesEnter[lstart].append("path")
			.attr("class", "l"+lstart)
				.attr("d", function(d){
					//数据转换			
					var a = [	
								[xScale(lstart), yScales[lstart](d[0])+y0/2],
								[xScale(lend), yScales[lend](d[1])+y1/2]
							];
					return linepath(a);
				})
//				.attr("stroke", "#6CA6CD")
				.attr("stroke", function(d,i){
					return computeColor(colorLinear(d[2]));
				})
		      	.attr("stroke-width", function(d,i){
//		      		var count = getCount(countData, d[0]);
//		      		var linew = rectH/3 + lineScale(count);
		      		return linew;
		      	})
		        .attr("fill", "none")
		        .attr("onclick", function(d,i){

		        });
	
		
	})
	
	
	
	//属性块；
	var attrRects = [];
	var attrRectUpdate = [];
	var attrRectEnter = [];
	var attrRectExit = [];	
	
	dimensions.forEach(function(d,i){
		var num = i;
		var content = d.key;
		var yContent = d.index;
		var yScale = yScales[content];
		var rectHScale = rectHeightScales[content];
		var countData = dataset1[content];
		console.log(countData);
		
		var rectH= rectHeights[content];
		
		attrRects[content] = s.selectAll("."+content);
		attrRectUpdate[content] = attrRects[content].data(yContent);
		attrRectEnter[content] = attrRectUpdate[content].enter();
		attrRectExit[content] = attrRectUpdate[content].exit();
		attrRectExit[content].remove();
		
		attrRectUpdate[content].attr("id", function(d,i){
				return content+d.toString;
			})
	    	.attr("x", xScale(content)+padding.left)
	    	.attr("y", function(d,i){
	    		return yScale(d)+padding.top;
	    	})
	    	.attr("width", rectWidth)
	    	.attr("height",  function(d){
	    		var cou = getCount(countData, d);
	    		if(cou==0)
	    			return rectH;
	    		else
	    			return rectH+rectHScale(cou);
	    	})
	    	.attr("fill", function(d,i){
	    		var cou = getCount(countData, d);
	    		
	    		if(cou=="0")
	    			return "#ccc";
	    		else
	    			return "#6CA6CD";
	    	})
	    	.on("mouseover", function(d,i){
	    		var sattr = d3.select(this).attr("class");
	    		var tx = d3.select(this).attr("x") + rectWidth/2;
	    		var ty = d3.select(this).attr("y");
	    		var contentName = contentChinese[sattr][i];
	    		
	    		s.append("text")
	    			.attr("id", "movemark")
	    			.style("text-anchor", "middle")
	    			.style("font-size","18px")
				    .attr("x", function(d,i){
				    	return tx;
				    })
				    .attr("y", function(d,i){
				    	return ty;
				    })
				    .text(contentName);
	    		

			})
	    	.on("mouseout", function(d,i){
	    		s.select("#movemark")
	    			.remove();
	    	})
	    	.on("click", function(d,i){
	    		//属性类型名
	    		var sattr = d3.select(this).attr("class");
	    		//属性具体名
	    		var sid = d;
	    		
	    		var exist = flags[sattr].indexOf(sid);
	    		if(exist== -1){
	    			d3.select(this)
	    				.attr("fill", "#6CA6CD");
	    			flags[sattr].push(sid);
	    			
	    		}
	    		else{
	    			d3.select(this)
	    				.attr("fill", "#ccc");
	    			flags[sattr].splice(exist, 1);

	    			
	    		}
	    		
	    		exist = flags[sattr].indexOf("0");
	    		if(exist!=-1){
	    			flags[sattr].splice(exist, 1);
	    		}
	    		
	    		xContent.forEach(function(d,i){
	    			var c = d;
	    			var str = "";
	    			if(flags[c]==null){
	    				str = "0";
	    			}
	    			else{
	    				flags[c].forEach(function(d,i){
	    					str = str+d+"/";
	    				})
	    				str = str.substring(0,str.length-1);
	    			}
	    			window.attrFlag[i] = str;
	    		})
	        	
	    		console.log(window.attrFlag);
	    		
	    		func();
	    		
	    	});
		
		attrRectEnter[content].append("rect")
			.attr("class", content)
			.attr("id", function(d,i){
				return content+d.toString;
			})
	    	.attr("x", xScale(content)+padding.left)
	    	.attr("y", function(d,i){
	    		return yScale(d)+padding.top;
	    	})
	    	.attr("width", rectWidth)
	    	.attr("height", function(d){
	    		var cou = getCount(countData, d);
	    		if(cou==0)
	    			return rectH;
	    		else
	    			return rectH+rectHScale(cou);
	    	})
	    	.attr("fill", function(d,i){
	    		var cou = getCount(countData, d);
	    		
	    		if(cou=="0")
	    			return "#ccc";
	    		else
	    			return "#6CA6CD";

	    	})
	    	.on("mouseover", function(d,i){
	    		var sattr = d3.select(this).attr("class");
	    		var tx = d3.select(this).attr("x");
	    		var ty = d3.select(this).attr("y");
	    		var contentName = contentChinese[sattr][i];
	    		
	    		s.append("text")
	    			.attr("id", "movemark")
	    			.style("text-anchor", "middle")
	    			.style("font-size","18px")
				    .attr("x", function(d,i){
				    	return tx;
				    })
				    .attr("y", function(d,i){
				    	return ty;
				    })
				    .text(contentName);
	    		

			})
	    	.on("mouseout", function(d,i){
	    		s.select("#movemark")
	    			.remove();
	    	})
	    	.on("click", function(d,i){
	    		//属性类型名
	    		var sattr = d3.select(this).attr("class");
	    		//属性具体名
	    		var sid = d;
	    		
	    		if(d=="null"){
	    			alert("该选项为不明，不可选择！");
	    		}
	    		else{
	    			
	    		var exist = flags[sattr].indexOf(sid);
	    		if(exist== -1){
	    			d3.select(this)
	    				.attr("fill", "#6CA6CD");
	    			flags[sattr].push(sid);
	    			
	    		}
	    		else{
	    			d3.select(this)
	    				.attr("fill", "#ccc");
	    			flags[sattr].splice(exist, 1);

	    			
	    		}
	    		
	    		exist = flags[sattr].indexOf("0");
	    		if(exist!=-1){
	    			flags[sattr].splice(exist, 1);
	    		}
	    		
	    		xContent.forEach(function(d,i){
	    			var c = d;
	    			var str = "";
	    			if(flags[c]==null){
	    				str = "0";
	    			}
	    			else{
	    				flags[c].forEach(function(d,i){
	    					str = str+d+"/";
	    				})
	    				str = str.substring(0,str.length-1);
	    			}
	    			window.attrFlag[i] = str;
	    		})
	        	
	        	
				
	    		console.log(window.attrFlag);
	    		
	    		
	    		
	    		func();
	    		}
	    		
	    	});
	})
	
}





function getDimensions(strings){
	var dims = [
		{
			"key":"tq",
			"name":"天气",
			"num":0,
			"index":["19","2","3","4","5","6","7","8","9","1"],
			"description":["其他","阴","雨","雪","雾","大风","沙尘","冰雹","霾","晴"],
			"scale":d3.scale.ordinal(),
			"axis":d3.svg.axis().orient("left")	
		},
		{
			"key":"cljsg",
			"name":"车辆间事故",
			"num":1,
			"index":["null","1","2","3","4","5","6","7","8","9"],
			"description":["不明","追尾碰撞","正面碰撞","侧面碰撞(同向)","侧面碰撞(对向)","侧面碰撞(直角)","侧面碰撞(角度不确定)","同向刮擦","对向刮擦","其他角度碰撞"],
			"scale":d3.scale.ordinal(),
			"axis":d3.svg.axis().orient("left")	
		},
		{
			"key":"dcsg",
			"name":"单车事故",
			"num":2,
			"index":["null","11","12","13","14","15","16","17","18","19","20","21","29","31","32","39"],
			"description":["不明","中央隔离设施","同向护栏","对向护栏","交通标识支撑物","缓冲物","直立的杆或路灯柱","树木","桥墩","隧道口挡墙","建筑物","山体","其他","动物","作业/维修设备","其他"],
			"scale":d3.scale.ordinal(),
			"axis":d3.svg.axis().orient("left")	
		},
		{
			"key":"rdyyfl",
			"name":"认定原因",
			"num":3,
			"index":["null","11","12","13","14","15","18","19","20","21","22","23","24","25","26","27","28","29","31","32","33","41","49","50","51","52","53","55","56","57","58","59","60","61","62","63","64","69","73","74","75","76","77","78","79","80","81","82","83","89","90","91","92","93","94","95","96","97","98","99"],
			"description":[],
			"scale":d3.scale.ordinal(),
			"axis":d3.svg.axis().orient("left")	
		},
		{
			"key":"sgxt",
			"name":"事故形态",
			"num":4,
			"index":["null","01","02","11","12","19","21","22","23","29","31","32","33","34","35","36","37","38"],
			"description":["不明","其他","其他","碰撞运动车辆","碰撞静止车辆","其他车辆间事故","刮撞行人","碾压行人","碰撞后碾压行人","其他车辆与人事故","侧翻","滚翻","坠车","失火","撞固定物","撞非固定物","自身摺叠","乘员跌落或抛出"],
			"scale":d3.scale.ordinal(),
			"axis":d3.svg.axis().orient("left")	
		}
	];
	
	var temp = [];
	strings.forEach(function(d,i){
		var str = d;
		dims.forEach(function(d,i){
			if(d.key == str){
//				console.log(d);
				temp.push(d);
			}
		
		});
	});
	
	return temp;
	
}


function getContent(d, string){
	if(string == "tq")
		return d.tq;
	else if(string == "cljsg")
		return d.cljsg;
	else if(string == "dcsg")
		return d.dcsg;
	else if(string == "sgxt")
		return d.sgxt;
	else if(string == "rdyyfl")
		return d.rdyyfl;
	else if(string == "xzqh")
		return d.xzqh;
	else if(string == "count")
		return d.count;
}

function getCount(data,string){
	a = 0;
	data.forEach(function(d,i){
		if(d[0]==string)
			a = d[1];
	})
	return a;
}

function getAttrCount(data){
	var a = window.attrs;
	var counts = [];
	data.forEach(function(d, i){

		if(i<data.length-1){
		
			var attrKey = a[i];
			counts[attrKey] = [];
			d.forEach(function(d,i){
				var content = getContent(d, attrKey);
				counts[attrKey].push([content, d.count]);
			});
		
		}
		else{
			var attrKey = a[i];
			counts[attrKey] = [];
			data[i-1].forEach(function(d,i){
				var content = getContent(d, attrKey);
				counts[attrKey].push([content, d.count]);
			});
								
			var attrKey = a[i+1];
			counts[attrKey] = [];
			d.forEach(function(d,i){
				var content = getContent(d, attrKey);
				counts[attrKey].push([content, d.count]);
			});

		}

	});

	return counts;
}