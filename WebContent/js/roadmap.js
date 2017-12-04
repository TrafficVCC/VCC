function displayMap (id) {
		//创建地图
		var map = new BMap.Map(id, {enableMapClick:false});
		map.centerAndZoom("合肥",15);
		map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
}