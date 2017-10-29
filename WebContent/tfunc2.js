var syear;
var smonth;
var sday;

var graph="";

var width = 1000;
var hight =160;
    
var padding = {top:30, right:50, bottom: 30, left:50 };

var xScale;
var yScale;

function getDataTo(dataset, data){
    for( var i=0; i<dataset.length; i++){
        data[i] = [ydata[i].year, ydata[i].sgcount];
    }

}

function getMax1(data, j){
    var cmax = 0;
    for(var i=0; i<data.length; i++){
        cmax = Math.max(cmax, data[i][j]);
    }  
    return cmax;
    console.log(cmax);
}

function getMin1(data, j){
    var cmin = data[0][j];
    for(var i=1; i<data.length; i++){
        cmin = Math.min(cmin, data[i][j]);
    }  
    return cmin;
}




//画点
function drawPoints(data, str){
    d3.select("#"+str)
        .selectAll("circle")
        .data(data) 
        .enter()  
        .append('circle') 
        .attr("id", function(d){
            return d[0];
        })
        .attr('cx', function(d) {  
            return xScale(d[0])+padding.left;  
        })  
        .attr('cy', function(d) {  
            return yScale(d[1])+padding.top;  
        })  
        .attr('r', function(d) {  
            return Math.sqrt(30);  
        })
        .attr("fill", d3.rgb(62,82,91) );
    
    setClick(str);

}

//画线
function drawLine1(data, str){
    var linePath =d3.svg.line()
        .x(function(d){
            return xScale(d[0]) + padding.left;
        })
        .y(function(d){
            return yScale(d[1]) + padding.top;
        });

    d3.select("#"+str)
        .selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("d",linePath(data))
        .attr("stroke", d3.rgb(62,82,91))
        .attr("stroke-width", 2)
        .attr("fill", "none");
}


//画xy轴
function drawXY(str){
    var x_axis = d3.svg.axis()
                    .scale(xScale);
    var y_axis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");

    var g = d3.select("#"+str)  
            .append("g") 
            .attr("transform","translate("+padding.left+","+padding.top+")")  ;

    d3.select("#"+str)
        .append("g")
        .attr("transform", "translate(" + padding.left + "," + (hight - padding.bottom) + ")")
        .attr("id", "xline")
        .call(x_axis);


}

function drawBack(str){
    d3.select("#"+str)
        .append("rect")
        .attr("transform","translate("+(padding.left - 5)+","+(padding.top-5)+")")  
        .attr("width", width - padding.left - padding.right +10)
        .attr("height", hight - padding.top - padding.bottom +5)
        .attr("fill", d3.rgb(239,238,246))
        .on("click", function(){
    //        alert("cancle!");
        });
}

function drawLineGraphByYear()
{
	
    $.post("/Demo/BackServer",
     	    {
	  			"type":"year",   //年份
	  			"starty" :"2006",
	  			"endy" : "2016",
	  			"set" : "0"     //全体
  	 	    },
            function(data,status){
  	 	    
  	 	    	js = eval('(' + data + ')');
                console.log("数据：" + js + "\n状态：" + status);
                gragh = "c"+"year";
                drawLineByYear(js, gragh, function (d){
                	alert(1);
                });
   	        });
        
     
}
function drawLineGraph(data, str){
    var dataset = [];
//    data.forEach(function(d){
//        dataset.push([d.year, d.count[0]]);
//    })
    for(var i=0; i<data.length; i++){
    	dataset.push([data[i].year, data[i].count[0]]);
    }
  
    console.log(dataset);
    d3.select("#"+str).selectAll()
    	.remove();
    var cmax = getMax1(dataset, 1);
    console.log(cmax);
    //console.log(data[0][0])

    xScale = d3.scale.linear()
                    .domain([dataset[0][0], dataset[dataset.length-1][0]])
                    .range([0, width - padding.left - padding.right]); 
    yScale = d3.scale.linear()
                    .domain([0, cmax])
                    .range([hight - padding.top - padding.bottom, 0]);
    
    drawXY(str);
    
 
    drawLine1(dataset, str);
    drawPoints(dataset, str);
    
    
}


function setClick(str){
    d3.select("#"+str)
    .selectAll("circle")
    .on("click", function(d){
    	syear = d[0];
    	 $.post("/Demo/BackServer",
    	     	    {
    		  			"type":"month",   //年份
    		  			"starty" :syear,
    		  			"endy" : syear,
    		  			"set" : "0"     //全体
    	  	 	    },
    	            function(data,status){
    	  	 	    
    	  	 	    	js = eval('(' + data + ')');
    	                console.log("数据：" + js + "\n状态：" + status);
    	                d3.select("#rose4").remove();
    	                d3.select("#"+"Hello")
    	                .append("svg")
    	                .attr("id","rose4")
    	                .attr("width",400)
    	                .attr("height",400);
    	                drawRose(js, "rose4");
    	   	        });
    })
    .on("mouseover", function(d){
    
        syear = d[0];
    
        d3.select(this)
            .transition()
            .duration(300)
            .attr('r',  function(d) {  
                return Math.sqrt(60);  
            });
    
        d3.select("#"+str)
            .append("text")
            .attr("id", "text")
            .text(d[1])
            .attr("x", function(){
                return xScale(d[0]) +padding.left +10;
            })
            .attr("y", function() {
                return yScale(d[1]) +padding.top +10;
            });

    })
    .on("mouseout", function(d){
        d3.select("#"+str)
            .selectAll("circle")
            .attr('r',  function(d) {  
                return Math.sqrt(30);  
            });
        d3.select("#text")
            .remove();
        
    });
}






