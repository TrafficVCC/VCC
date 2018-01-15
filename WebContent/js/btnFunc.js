function onOpen () {
	flag = true;
	var name = $("input:text").val();
	if(name!="") {
		// 创建地址解析器实例
		var myGeo = new BMap.Geocoder();
		// 将地址解析结果显示在地图上,并调整地图视野
		myGeo.getPoint(name, function(point){
			if (point) {
				map.centerAndZoom(point, 16);
				//map.addOverlay(new BMap.Marker(point));
			}else{
				layer.msg("您选择地址没有解析到结果!");
			}
		}, "合肥市");
	}
}

function onSubmit () {
	var name = $("input:text").val();
	if(name=="") {
		layer.msg("请输入路名");
		return;
	}
	road.way = name;
	alert(road.way);
	for(var ld=0; ld<overlays.length; ld++) {
		var obj = {"ld":ld, "points":overlays[ld].getPath()};
		road.data.push(obj);
	}
	console.log(road);

	$.post("/Demo/MapServlet",
		{
			"data": JSON.stringify(road)
		},
		function(data, status) {
			layer.msg(status);
		}
	);
}	