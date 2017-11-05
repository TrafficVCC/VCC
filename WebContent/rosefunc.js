//玫瑰图相关函数和变量

var w = 400;
var h = 400;



var color1 = d3.rgb(255,250,250);
//var color1 = d3.rgb(255,255,255);
var color2 = d3.rgb(175,0,0);



function getMax(a){
    var max=a[0];
    for(var i=1; i<a.length; i++){
        max = Math.max(max, a[i]);
    }
    return max;
}

function getMin(a){
    var min = a[0];
    for(var i=1; i<a.length; i++){
        min = Math.min(min, a[i]);
    }
    return min;
}



function drawRose(data, str){
    var dataset = [];
    var maxs = [];
    var mins = [];
    //提取数据，根据需求改变格式
    data.forEach(function(d){
        dataset.push([d.year,d.count]);
    });

//    console.log(dataset);
    dataset.forEach(function(d){
        maxs.push(getMax(d[1]));
        mins.push(getMin(d[1]));
    })
    var max,min;
    max = getMax(maxs);
    min = getMin(mins);
    console.log(max, min);
    


    var piece = dataset[0][1].length;
//    console.log(piece);

    var piedata = [];
    var angles = [];
    //console.log([(Math.PI)*2]/piece);
    angles[0] = 0;
    for(var i=1; i<=piece; i++){
        angles.push( angles[i-1]+[(Math.PI)*2]/piece );
    }
//    console.log(angles);
    
    // 每年循环从里向外画圈圈
    for(var j=0; j<dataset.length; j++){
        //根据要画的弧数，给角度
//        piedata=[];
        for(var i=0; i<piece; i++){
                piedata.push({"startAngle":angles[i], "endAngle":angles[i+1], "padAngle":0, "value":dataset[j][1][i], "time":[dataset[j][0],i+1], "type":[piece, i+1]});
        }
//        console.log(piedata);
        //画圈圈
        drawCircle(str, piedata,j,max,min, dataset.length);
        
    }
        //画两直线
    drawLine(str,piece);

    if(piece==4)
        markType("季度",str);
    else if(piece==12)
        markType("月份",str);
    else if(piece==7)
        markType("星期",str);
    else if(piece==24)
        markType("小时",str);

        if(j==dataset.length-1){ 
            console.log(j);
            var outerRadius = h/3;
            var innerRadius = h/3;
            
            console.log(piedata);

            var arc = d3.svg.arc()  
                        .innerRadius(innerRadius)  
                        .outerRadius(outerRadius);
            
            var arcs = d3.select("#"+str)
                    .selectAll("g")
                    .data(piedata)  
                    .enter()  
                    .append("g")  
                    .attr("transform","translate(" + (w/2) +","+ (h/2) +")");
            		
                    arcs.append("text")  
                        .attr("transform",function(d){  
                            var x=arc.centroid(d)[0]*2.5;  
                            var y=arc.centroid(d)[1]*2.5;  
                            return "translate("+x+","+y+")";  
                        })  
                        .attr("text-anchor","middle")  
                        .text(function(d){  
                            return d.type[1];  
                        })
                        .on("click", function(d){
                            //
                        }); 

        }




}

//function markNum()


function drawCircle(str, piedata, j, max, min, a){
    //color
    var linear = d3.scale.linear()  
                .domain([min,max])  
                .range([0,1]);
    var compute = d3.interpolate(color1,color2);  
    
    //内外径
    var outerRadius = [(h/3)/a]*(j+1)+j;  
    var innerRadius = [(h/3)/a]*j+j;
    
    var arc = d3.svg.arc()  
                .innerRadius(innerRadius)  
                .outerRadius(outerRadius);  
    
    var arcs = d3.select("#"+str)
            .selectAll("g")
            .data(piedata)  
            .enter()  
            .append("g")  
            .attr("transform","translate(" + (w/2) +","+ (h/2) +")");

    arcs.append("path")  
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
            alert(d.value);
            alert(d.time, this.id);
        }); 
    
//    if(j==10){
//        arcs.append("text")  
//            .attr("transform",function(d){  
//                var x=arc.centroid(d)[0]*2.5;  
//                var y=arc.centroid(d)[1]*2.5;  
//                return "translate("+x+","+y+")";  
//            })  
//            .attr("text-anchor","middle")  
//            .text(function(d){  
//                return d.type[1];  
//            })
//            .on("click", function(d){
//                //
//            }); 
//    }
    
   
}

function drawLine(str, piece){
    var lineGenerator = d3.svg.line()
                          //    获取每个节点的x坐标
                          .x(function(d) {
                                return d[0]
                            })
                           //   获取每个节点的y坐标
                           .y(function(d) {
                                return d[1];
                           });
    var xline = [ [w/2, h/2], [w, h/2] ];
    var yline = [ [w/2, h/2], [w/2, 0] ];
    d3.select("#"+str)
        .append("path")
        .data(xline)
        .attr('stroke', 'white')
        .attr('stroke-width', '1')
        .attr('fill', 'none')
        .attr('d', lineGenerator(yline));
//    d3.select("#"+str)
//        .append("path")
//        .data(xline)
//        .attr('stroke', 'white')
//        .attr('stroke-width', '1')
//        .attr('fill', 'none')
//        .attr('d', lineGenerator(xline));

}


//标记类型
function markType(t,str){
    d3.select("#"+str)
        .append("text")
        .text(t)
        .attr("transform", "translate("+w/2+","+22+")");

}

function drawRoseGraphByYear()
{
	$.post("/Demo/TimeServlet",
			 {
			"type":"quarter",   //年份
			"starty" :"2006",
			"endy" : "2016",
			"set" : "0"     //全体
	    },
            function(data,status){
	    	data = eval('(' + data + ')');
                console.log("数据：" + data + "\n状态：" + status);
                gragh = "rose"+"1";
                drawRose(data, gragh);
   	        });
}
function drawRoseGraphByMonth()
{
	$.post("/Demo/TimeServlet",
			 {
			"type":"month",   //年份
			"starty" :"2006",
			"endy" : "2016",
			"set" : "0"     //全体
	    },
            function(data,status){
	    	data = eval('(' + data + ')');
                console.log("数据：" + data + "\n状态：" + status);
                gragh = "rose"+"2";
                drawRose(data, gragh);
   	        });
}
function drawRoseGraphByWeek()
{
	$.post("/Demo/TimeServlet",
			 {
			"type":"week",   //年份
			"starty" :"2006",
			"endy" : "2016",
			"set" : "0"     //全体
	    },
            function(data,status){
	    	data = eval('(' + data + ')');
                console.log("数据：" + data + "\n状态：" + status);
                gragh = "rose"+"3";
                drawRose(data, gragh);
   	        });
}