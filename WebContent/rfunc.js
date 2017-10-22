




function drawPie(data, str, w, h){
    
    var pie = d3.layout.pie()
                .value(function(d){  
                    return d[1];  
                });

    var piedata = pie(data);  

    console.log(piedata);

    var outerRadius = h/3 ;  
    var innerRadius = 0;

    var arc = d3.svg.arc()  
                .innerRadius(innerRadius)  
                .outerRadius(outerRadius);  
    var color = d3.scale.category20();  

    var arcs = d3.select("#"+str)
                    .selectAll("g")  
                    .data(piedata)  
                    .enter()  
                    .append("g")  
                    .attr("transform","translate(" + (w/2) +","+ (h/2) +")");

    arcs.append("path")  
        .attr("fill",function(d,i){  
            return color(i);  
        })  
        .attr("d",function(d){  
            return arc(d);
        })
        .on("click", function(d){
            alert(d.data[0]);
            alert(1); 
            $.post("/Demo/BackServer",
         			 {
         			"type":"week",   //年份
         			"starty" :"2006",
         			"endy" : "2016",
         			"set" : d.data[0]     //全体
         	    },
                     function(data,status){
         	    	alert(data);
         	    	data = eval('(' + data + ')');
                         console.log("数据：" + data + "\n状态：" + status);
                         d3.select("#roseDiv").append("svg")
                         .attr("width",500)
                         .attr("height",500)
                         .attr("id","r"+d.data[0]);
                         gragh = "roseYear";
                         drawRose(data,"r"+d.data[0]);
            	        });
            
            	
                $.post("/Demo/BackServer",
                 	    {
            	  			"type":"year",   //年份
            	  			"starty" :"2006",
            	  			"endy" : "2016",
            	  			"set" :d.data[0]     //全体
              	 	    },
                        function(data,status){
              	 	    
              	 	    	js = eval('(' + data + ')');
                            console.log("数据：" + js + "\n状态：" + status);
                            d3.select("#roseDiv").append("svg")
                            .attr("width",1000)
                            .attr("height",210)
                            .attr("id","z"+d.data[0]);
                            drawLineGraph(js, "z"+d.data[0]);
               	        });
                    
                 
            
        }); 

    //添加弧内的文字  
    arcs.append("text")  
        .attr("transform",function(d){  
            var x=arc.centroid(d)[0]*1.4;//文字的x坐标  
            var y=arc.centroid(d)[1]*1.4;  
            return "translate("+x+","+y+")";  
        })  
        .attr("text-anchor","middle")  
        .text(function(d){  
            //计算市场份额的百分比  
    //        var percent=Number(d.value)/d3.sum(data,function(d){  
    //            return d[1];  
    //        })*100;  
    //        //保留一位小数点 末尾加一个百分号返回  
    //        return percent.toFixed(1)+"%";  
            return d.data[1];
        })
        .on("click", function(d){
            alert(d.data[0]);
            alert(2);
        });  

    //添加连接弧外文字的直线元素  
    arcs.append("line")  
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
    //添加弧外的文字元素  
    arcs.append("text")  
        .attr("transform",function(d){  
            var x=arc.centroid(d)[0]*2.5;  
            var y=arc.centroid(d)[1]*2.5;  
            return "translate("+x+","+y+")";  
        })  
        .attr("text-anchor","middle")  
        .text(function(d){  
            return d.data[0];  
        })
        .on("click", function(d){
            alert(d.data[0]);
            alert(3);
        

        }); 
    
}

