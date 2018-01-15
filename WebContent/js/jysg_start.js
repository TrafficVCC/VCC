
function show(){
	
}
function saveServie()
{
	alert(1);
	 $.post("/Demo/SaveDfldServlet",
	{
		"lm": window.road,
		"hotdata": window.hotdata
	},
   		function(data,status){
	    	if(data == 0)
	    	{
	    		alert(0);
	    	}
   		});
}
function confirm()
{
	var t = $("#threodput").val();
	
	if(t=="")
	{
		alert("请输入阈值");
		return;
	}

	 var dataList = findhot(option.series[0].data,t);
	 $.post("/Demo/DfldServlet",
		{
			"lm": window.road,
			"data[]": dataList
		},
	   		function(data,status){
		    	js = eval('(' + data + ')');
		    	window.hotdata= data;
		    	var js_road = js[0].road;
		    	
		    	displayIntensityJdwz([]);
		    	displayRoad(js_road);
		    	
		    	var js_dfld = js[0].dfld;
		    	displayDfld(js_dfld);
		   	 	console.log(js);
		   	 	$('#saveButton').removeAttr("disabled").removeClass("layui-btn-disabled");
	   		});
	
}
function updatecontentA()
{
	$.post("/Demo/TimeServlet",
			{
				"type":"month",   //月份
				"year[]": window.years,
				"set[]" : window.roadList     //全体
			},
			function(data,status){
			    js = eval('(' + data + ')');
			    drawStackedLine(js, "graphA1", clickStackArea);
			});
}
function updatecontentB()
{
	$.post("/Demo/RoadServlet",
			{
		 		"type":"lm",
				"year[]":  window.years,
				"month[]": window.months,
				"lm[]": window.originRoads
		    },
		     function(data,status){
		    	js = eval('(' + data + ')');
				drawRoadP(js, 'contentB', clickPie, window.originRoads);
		    });
}
function updatecontentC()
{
	$.post("/Demo/OtherServlet",
			{
				"type":"factor",   //属性
			    "year[]": window.years,
				"set[]" : window.roadList,    //全体
				"attr[]": window.attrs,		//js会将attr转换成attr[],所以最好直接写成attr[]
				"content[]": window.attrFlag
			},
			    function(data,status){
				js = eval('(' + data + ')');
				drawAG(js, "graphC", clickAttrRect);
			});
	
}
function updatecontentD()
{
	 $.post("/Demo/RoadNetServlet",
		   		{
				 	"type": "coor",
		   			"year": window.years,
		   			"month": window.months ,
		   			"lm": window.road
		   	    },
		               function(data,status){
		   	    	js = eval('(' + data + ')');
		   	    	js_road = js[0].road;	//道路数据,用于绘制道路
		   	        js_point = js[0].location;	//绝对位置对应的经纬度坐标
		               displayRoad(js_road);
		               displayIntensityJdwz(js_point);
		      	    });
}
function updatecontentE()
{
	 $.post("/Demo/RoadFittingServlet",
				{
					"type":"road_fitting",  
					"year[]": window.years,		//最好一定加上[]
					"month[]": window.months,
					"lm": window.road
			    },
		        function(data,status){
		    	 js= eval('(' + data + ')');
		    	 drawRoadA(js, 'main', show, window.roadList);
		    });

}

function jysg_start(){
	updatecontentA();
	updatecontentB();
	updatecontentC();
	updatecontentD();
	updatecontentE();
}
