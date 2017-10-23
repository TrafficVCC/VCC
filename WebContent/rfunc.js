
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

    var updatearcs = d3.select("#"+str)
                    .selectAll("g")  
                    .data(piedata);  
                
    var enterarcs= updatearcs.enter(); 
    var exitarcs = updatearcs.exit();
    
    exitarcs.remove();
    
    updatearcg = updatearcs.attr("transform","translate(" + (w/2) +","+ (h/2) +")");
   
    updatearcg.selectAll("path").attr("fill",function(d,i){  
        return color(i);  
    })  
    .attr("d",function(d){  
        return arc(d);
    })
    .on("click", function(d){
        
       
        $.post("/Demo/BackServer",
     			 {
     			"type":"week",   //年份
     			"starty" :"2006",
     			"endy" : "2016",
     			"set" : d.data[0]     //全体
     	    },
                 function(data,status){
     	    
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
    
    
    enterarcg = enterarcs.append("g")  
                    .attr("transform","translate(" + (w/2) +","+ (h/2) +")");
    enterarcg.append("path")  
        .attr("fill",function(d,i){  
            return color(i);  
        })  
        .attr("d",function(d){  
            return arc(d);
        })
        .on("click", function(d){
           
            $.post("/Demo/BackServer",
         			 {
         			"type":"week",   //年份
         			"starty" :"2006",
         			"endy" : "2016",
         			"set" : d.data[0]     //全体
         	    },
                     function(data,status){
         	    
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
              
                $.post("/Demo/DataServlet",
                 	    {
            	  			"lh" :d.data[0]     //全体
              	 	    },
                        function(data,status){
              	 	    	
              	 	    	displayRoadInfo(data);
               	        });
                    
                 
            
        }); 

    //添加弧内的文字  
    enterarcg.append("text")  
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
        });  

    //添加连接弧外文字的直线元素  
    enterarcg.append("line")  
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
    enterarcg.append("text")  
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

function displayRoadInfo(roadnum){
	
    var roadName = d3.select("#roadname");
    js = eval('(' + roadnum + ')');
    
    d3.select("#roadname")
        .selectAll("text")
        .remove();
    d3.select("#roadname")
        .append("text")
        .text(js[0].lh)
        .attr('x', 20)
        .attr('y', 50)
        .attr("fill", "steelblue");
    
    d3.select("#rect2")
        .selectAll("rect")
        .remove();
    d3.select("#rect2")
        .selectAll("text")
        .remove();
    dataset2 = [];

  
    js.forEach(function(d){
    	if(d.jdwz!=null)
    			dataset2.push(d.jdwz);
    });

    
 	
    d3.select("#rect2")
        .append("rect")
        .attr("transform","translate("+ padding.left +","+ padding.top +")")  
        .attr("width", 1000 - padding.left)
        .attr("height", 150 - padding.top - padding.bottom -20 )
        .attr("fill", d3.rgb(100,100,100))
        .on("click", function(){
    //        alert("cancle!");
        });
    
    var cmax = getMax(dataset2);
    var cmin = getMin(dataset2);
  
    
    xScale = d3.scale.linear()
        .domain([cmin, cmax])
        //.domain([0, (cmax+10)*1000])
        .range([0, 1000 - padding.left - padding.right]); 

    
    d3.select("#rect2")
        .selectAll("rect")
        .data(js)
        .enter()  
        .append("rect")
        .attr("transform","translate(" + padding.left +","+ padding.top +")")
        .attr("x", function(d,i){
//                return xScale(d[4])+padding.left;
                return xScale(d.jdwz);
            })
        .attr("y",function(d,i){ 
                return 0;  
            })  
        .attr("width", 2)  
        .attr("height", 150 - padding.top - padding.bottom-20) 
        .attr("opacity", 0.5)
        .on("click",function(d)
        		{
        			alert(d.jdwz);
        		})
        .attr("fill", d3.rgb(255,255,255))
        .transition()
        .attr("fill", d3.rgb(255,0,0))
        .delay(function(d,i){
            return d.time;
        });
        
      
    
}