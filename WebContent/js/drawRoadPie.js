//data: lh和数量的json字符串。
//结构：[{"lh":"XXX","count":d},{…，…}，……]
//svgId：画布id的字符串
//func：点击扇形可触发的函数。
//func(d). d中可用属性：d.data[0]:路号, d.data[1]:事故数量, d.value:事故数量.

//画关于道路发生事故数量的信息的饼图
function drawRoadPie(data, svgId, func){
	//
	var dataset = [];
	data.forEach(function(d){
		dataset.push([d.lh, d.count]);
	});
	
	var width = d3.select("#"+svgId).attr("width");
	var height = d3.select("#"+svgId).attr("height");

	//边缘
	var padding = width/50;
	
	//颜色
	var color = d3.scale.category20(); 
	
	//关于饼图的布局函数
	var pie = d3.layout.pie()
					.value(function(d){  
				            return d[1]; 
				        });
    var piedata = pie(dataset);
    
    //内外径
    var outerRadius = (height - (padding*2))/3 ; 
    var innerRadius = 0;

    var arc = d3.svg.arc()  
            	.innerRadius(innerRadius)  
                .outerRadius(outerRadius);  
    
    //绑定画布
    var s = d3.select("#"+svgId);
    
    s.selectAll("g")
		.remove();
    //添加群组
    var g = s.selectAll("g");
    var updateG = g.data(piedata);
    var enterG= updateG.enter(); 
    var exitG = updateG.exit();
//  exitG.remove();

    //画扇形
    var updateArc = updateG.attr("transform","translate(" + (width/2) +","+ (height/2) +")");
    updateArc.selectAll("path")
    	.attr("fill",function(d,i){
	        return color(i);  
	    })  
	    .attr("d",function(d){  
	        return arc(d);
	    })
	    .on("click", function(d){
	    	func(d);
	    });
	
	var enterArc = enterG.append("g")
					.attr("transform","translate(" + (width/2) +","+ (height/2) +")");
	enterArc.append("path")
		.attr("fill",function(d,i){
	        return color(i);  
	    }) 
	    .attr("d",function(d){  
	        return arc(d);
	    })
	    .on("click", function(d){
	    	func(d);
	    });
	
	//添加标签文字数字
	enterArc.append("text")  
        .attr("transform",function(d){  
            var x=arc.centroid(d)[0]*1.4;//文字的x坐标  
            var y=arc.centroid(d)[1]*1.4;  
            return "translate("+x+","+y+")";  
        })  
        .attr("text-anchor","middle")  
        .text(function(d){  
            return d.data[1];
        });
	
	enterArc.append("line")  
        .attr("stroke","black")  
        .attr("x1",function(d){  
            return arc.centroid(d)[0]*2;  
        })  
        .attr("y1",function(d){  
            return arc.centroid(d)[1]*2;  
        })  
        .attr("x2",function(d){  
            return arc.centroid(d)[0]*2.2;  
        })  
        .attr("y2",function(d){  
            return arc.centroid(d)[1]*2.2;  
        });  
        
    enterArc.append("text")  
        .attr("transform",function(d){  
            var x=arc.centroid(d)[0]*2.5;  
            var y=arc.centroid(d)[1]*2.5;  
            return "translate("+x+","+y+")";  
        })  
        .attr("text-anchor","middle")  
        .text(function(d){  
            return d.data[0];  
        }); 

}
