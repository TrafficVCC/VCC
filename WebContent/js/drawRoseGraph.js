//data:[{"year":d, "count":[d1, d2, …, …]}, {…, …}, …… ]
//svgId:
//func:

//画玫瑰图
function drawRoseGraph(data, svgId, func){
	//整理需要的数据格式
	var dataset = [];
	data.forEach(function(d){
		dataset.push([d.year, d.count]);
	});
	console.log(dataset);
	//提取svg的宽度长度
	var width = d3.select("#"+svgId).attr("width");
	var height = d3.select("#"+svgId).attr("height");
	//alert(width, height);
	
	//边缘
	var padding = {top:(height/20), right:(width/20), bottom:(height/20), left:(width/20) };
	
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
	var maxs = [];
	var mins = [];
	dataset.forEach(function(d){
        maxs.push(getmax(d[1]));
        mins.push(getmin(d[1]));
   	})
	var max,min;
    max = getmax(maxs);
    min = getmin(mins);
	
    //颜色比例尺
    var color1 = d3.rgb(255,250,250);
    var color2 = d3.rgb(175,0,0);
	var linear = d3.scale.linear()  
        .domain([min,max])  
        .range([0,1]);
    var compute = d3.interpolate(color1,color2);  
	
	//根据count数组长度确定要画的瓣数
	var piece = dataset[0][1].length;
	//角度数组
    var angles = [];
    angles[0] = 0;
    for(var i=1; i<=piece; i++){
        angles.push( angles[i-1]+[(Math.PI)*2]/piece );
    }
    
    //画图绑定的数据
    var piedata = [];
    //绑定画布
    var s = d3.select("#"+svgId);
    
    s.selectAll("g")
		.remove();
    
    //循环画图
    for(var j=0; j<dataset.length; j++){
    	//给piedata赋值
//  	var piedata = [];
    	for(var i=0; i<piece; i++){
            piedata.push({"outerRadius":[(height/3)/dataset.length]*(j+1)+j,"innerRadius":[(height/3)/dataset.length]*j+j,
            	"startAngle":angles[i], "endAngle":angles[i+1], "padAngle":0, 
            	"value":dataset[j][1][i], "time":[dataset[j][0],i+1], "type":[piece, i+1]});
        }
    }
    
    var arc = function(d){
    	var a = d3.svg.arc()
    			.innerRadius(d.innerRadius)
    			.outerRadius(d.outerRadius)
    	return a(d);
    }
    	
        var g = s.selectAll("g");
        var updateG = g.data(piedata);
        var enterG = updateG.enter();
        var exitG = updateG.exit();
//      exitG.remove();
        
        var updateA = updateG.attr("transform","translate(" + (width/2) +","+ (height/2) +")");
        updateA.selectAll("path")  
	        .attr("fill",function(d,i){  
	            return compute(linear(d.value));
	        })  
	        .attr("d",function(d){  
	            return arc(d);
	        })
	        .attr("id", function(d,i){
	            return d.type;
	        })
	        .on("click", function(d, i){
				func(d);
	        }); 
	        
	    var enterA = enterG.append("g")
	    					.attr("transform","translate(" + (width/2) +","+ (height/2) +")");
        enterA.append("path")
	        .attr("fill",function(d,i){  
		            return compute(linear(d.value));
		        })  
		        .attr("d",function(d){  
		            return arc(d);
		        })
		        .attr("id", function(d,i){
		            return d.type;
		        })
		        .on("click", function(d, i){
					func(d);
		        }); 
        
        
        //添加标签
        var dataset2 = [];
        for(var i=0; i<piece; i++){
            dataset2.push({"value":i, "startAngle":angles[i], "endAngle":angles[i+1], "padAngle":0});
        }
        console.log(dataset2);
        
        var arc = d3.svg.arc()
        			.innerRadius(0)
        			.outerRadius(height/3);

	
}


