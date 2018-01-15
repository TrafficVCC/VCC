//syear.选择的年份。
//smonth.选择的月份。
//data.选定某年某月的事故数量数据.
//结构：[{"day":XX,"count":XXX},……]
//svgId.画布Id
//func.点击矩形触发的函数。
//func(d).d[0]:(该块为)几号, d[1]:第几周, d[2]:周几, d[3]:事故数量.

//画日历图
function drawCalendar(syear, smonth, data, svgId, func){
	var stime = [[syear,smonth]];
	var xqTitle = ["日","一","二","三","四","五","六"];
	var dataset = [];
	var dataset2 = [];
	
	var days = d3.time.days(new Date(syear, smonth-1, 1), new Date(syear, smonth, 1));
	var weekBase = d3.time.weekOfYear(new Date(syear, smonth-1, 1));
	
	var mc = [];
	data.forEach(function(d){
		mc[d.day] = d.count;
	});
	
	days.forEach(function(d,i){
		a = i+1;
		b = d3.time.weekOfYear(d)-weekBase+1;
		c = d.getDay();
		e = 0;
		if(mc[a]){
			e = mc[a];
		}
		dataset.push([a,b,c,e]);
		dataset2.push(e);
	});
	console.log(dataset);
	//dataset:[日期，第几周，周几，数量]
	
	//提取svg的宽度长度
	var width = d3.select("#"+svgId).attr("width");
	var height = d3.select("#"+svgId).attr("height");
	//边缘
	var padding = height/20;
	
	//求最大最小值
	var min = dataset2[0];
	var max = 0;
	dataset2.forEach(function(d,i){
		min = Math.min(min, d);
		max = Math.max(max, d);
	});
	
	//颜色
	var color1 = d3.rgb(255,255,255);
    var color2 = d3.rgb(175,0,0);
	var linear = d3.scale.linear()  
        .domain([0,max])
        .range([0,1]);
    var compute = d3.interpolate(color1,color2);  
	
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
		.attr("fill","black");
		
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
		.attr("fill","black");
	
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
		.attr("fill","#E5E5E5")
		.attr("stroke", "#ccc");

	enterTitle.append("rect")
		.attr("class", "title")
		.attr("x", function(d,i){
			return padding+i*rectw;
		})
		.attr("y", padding+recth)
		.attr("width", rectw)
		.attr("height", recth)
		.attr("fill","#E5E5E5")
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
		.attr("fill", "black");
	
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
		.attr("fill", "black");
		
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
			return compute(linear(d[3]));
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
			return compute(linear(d[3]));
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
		.text(function(d){
			return d[0];
		});

}