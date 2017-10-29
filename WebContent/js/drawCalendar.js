//syear.选择的年份。
//smonth.选择的月份。
//data.选定某年某月的事故数量数据.结构：[{"day":XX, "xq":X, "count":XXX}, {…,…,…},……]
//svgId.画布Id
//func.点击矩形触发的函数。

//画日历图
function drawCal(syear, smonth, data, svgId, func){
	var stime = [[syear,smonth]];
	var xqTitle = ["日","一","二","三","四","五","六"];
	var dataset = [];
	var dataset2 = [];
	
	var days = d3.time.days(new Date(syear, smonth-1, 1), new Date(syear, smonth, 1));
	var weekBase = d3.time.weekOfYear(new Date(syear, smonth-1, 1));
	
	days.forEach(function(d,i){
		a = i+1;
		b = d3.time.weekOfYear(d)-weekBase+1;
		c = d.getDay();
		dataset.push([a,b,c]);
//		dataset.push([a,b,c,data[i].count]);
//		dataset2.push(data[i].count);
	});
	console.log(dataset);
	//dataset:[日期，第几周，周几，数量]
	
	//求最大最小值
	var getmax = function(a){
		var max=a[0];
	    for(var i=1; i<a.length; i++){
	        max = Math.max(max, a[i]);
	    }
	    return max;
	}
	var getmin = function(a){
		var min = a[0];
	    for(var i=1; i<a.length; i++){
	        min = Math.min(min, a[i]);
	    }
	    return min;
	}
	var max = getmax(dataset2);
	var min = getmin(dataset2);
	
	//颜色
	var color1 = d3.rgb(255,250,250);
    var color2 = d3.rgb(175,0,0);
	var linear = d3.scale.linear()  
        .domain([min,max])  
        .range([0,1]);
    var compute = d3.interpolate(color1,color2);  
	
	//提取svg的宽度长度
	var width = d3.select("#"+svgId).attr("width");
	var height = d3.select("#"+svgId).attr("height");
	//	alert(width, height);
	//边缘
	var padding = height/20;
	//判断
	var row = function(d){
		var week1 = d3.time.weekOfYear(d[0]);
		var week2 = d3.time.weekOfYear(d[d.length-1]);
		return week2-week1;
	}

	var rectw = (width - padding*2)/7;
	var recth = (height - padding*2)/(row(days)+3); 
	
	var s = d3.select("#"+svgId);
	
	///标记时间
	var t = s.selectAll(".time")
	var updateT = t.data(stime);
	var enterT = updateT.enter();
	var exitT = updateT.exit();
	exitT.remove();
	
	updateT.attr("x", function(d,i){
			return width/2;
		})
		.attr("y", padding+(recth)/1.5)
		.attr("text-anchor", "middle")
		.text(function(d){
			return d[0].toString()+"年"+d[1].toString()+"月";
		})
		.attr("fill","black")
		.attr("font-size",width/20);
		
	enterT.append("text")
		.attr("class", "time")
		.attr("x", function(d,i){
			return width/2;
		})
		.attr("y", padding+(recth)/1.5)
		.attr("text-anchor", "middle")
		.text(function(d){
			return d[0].toString()+"年"+d[1].toString()+"月";
		})
		.attr("fill","black")
		.attr("font-size",width/20);
	
	//画标题
	var title = s.selectAll(".title");
	var updateTitle = title.data(xqTitle);
	var enterTitle = updateTitle.enter();
	var exitTitle = updateTitle.exit();
	exitTitle.remove();
	
	updateTitle.attr("x", function(d,i){
			return padding+i*rectw;
		})
		.attr("y", padding+recth)
		.attr("width", rectw)
		.attr("height", recth)
		.attr("fill",d3.rgb(255,255,200))
		.attr("stroke", "#ccc");

	enterTitle.append("rect")
		.attr("class", "title")
		.attr("x", function(d,i){
			return padding+i*rectw;
		})
		.attr("y", padding+recth)
		.attr("width", rectw)
		.attr("height", recth)
		.attr("fill",d3.rgb(255,255,200))
		.attr("stroke", "#ccc");
	
	var w = s.selectAll(".xq")
	var updateW = w.data(xqTitle);
	var enterW = updateW.enter();
	var exitW = updateW.exit();
	exitW.remove();
	
	updateW.attr("x", function(d,i){
			return padding+i*rectw+rectw/2;
		})
		.attr("y", padding+recth+(recth)/1.5)
		.attr("text-anchor", "middle")
		.text(function(d){
			return d;
		})
		.attr("fill", "black")
		.attr("font-size",width/20);
	
	enterW.append("text")
		.attr("class","xq")
		.attr("x", function(d,i){
			return padding+i*rectw+rectw/2;
		})
		.attr("y", padding+recth+(recth)/1.5)
		.attr("text-anchor", "middle")
		.text(function(d){
			return d;
		})
		.attr("fill", "black")
		.attr("font-size",width/20);
		
	//画日历
	//矩形
	var c =s.selectAll(".cal");
	var updateC = c.data(dataset);
	var enterC = updateC.enter();
	var exitC = updateC.exit();
	exitC.remove();
	
	updateC.attr("x", function(d){
			return padding+(d[2])*rectw;
		})
		.attr("y", function(d){
			return padding+(d[1]+1)*recth;
		})
		.attr("width", rectw)
		.attr("height", recth)
		.attr("fill",function(d){
			return "none";
//			return compute(d[3]);
		})
		.attr("stroke", "#ccc")
		.on("click", function(d){
			func(d);
		});
		
	enterC.append("rect")
		.attr("class", "cal")
		.attr("x", function(d){
			return padding+(d[2])*rectw;
		})
		.attr("y", function(d){
			return padding+(d[1]+1)*recth;
		})
		.attr("width", rectw)
		.attr("height", recth)
		.attr("fill",function(d){
			return "none";
			return compute(d[3]);
		})
		.attr("stroke", "#ccc")
		.on("click", function(d){
			func(d);
		});
		
	//文本
	var n = s.selectAll(".num");
	var updateNum = n.data(dataset);
	var enterNum = updateNum.enter();
	var exitNum = updateNum.exit();
	exitNum.remove();
	
	updateNum.attr("x", function(d){
			return padding+(d[2])*rectw+rectw/2;
		})
		.attr("y", function(d){
			return padding+(d[1]+1)*recth+(recth)/1.5
		})
		.attr("text-anchor", "middle")
		.attr("font-size",width/20)
		.text(function(d){
			return d[0];
		});
	
	enterNum.append("text")
		.attr("class", "num")
		.attr("x", function(d){
			return padding+(d[2])*rectw+rectw/2;
		})
		.attr("y", function(d){
			return padding+(d[1]+1)*recth+(recth)/1.5
		})
		.attr("text-anchor", "middle")
		.attr("font-size",width/20)
		.text(function(d){
			return d[0];
		});

}
