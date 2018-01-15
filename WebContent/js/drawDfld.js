/**
 * 绘制事故多发路段
 */


//绘制整条道路
 function displayRoad(data) {
	 var index;
	 if(data.length%2 ==0)
		 index =data.length / 2;
	 else
		 index =(data.length-1) / 2;
	 var center = new BMap.Point(data[index].lng, data[index].lat);
	 map.centerAndZoom(center,16);
	 
	 map.clearOverlays();
	 var overlays = [];
     var points = [];
     var ld = 0;
     for(var i=0; i<data.length; i++) {
     	if(data[i].ld == ld) {
     		 var p = new BMap.Point(data[i].lng, data[i].lat);
             points.push(p);	
     	}
     	else {
     		overlays.push(points);
     		points = [];
     		var p = new BMap.Point(data[i].lng, data[i].lat);
            points.push(p);
     		ld = ld + 1;
     	}
     }
     overlays.push(points);
     //console.log(overlays);
		
     var styleOptions = {
         strokeColor:"blue",    //边线颜色。
         fillColor:"blue",      //填充颜色。当参数为空时，圆形将没有填充效果。
         strokeWeight: 10,       //边线的宽度，以像素为单位。
         strokeOpacity: 0.6,	   //边线透明度，取值范围0 - 1。
         fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
         strokeStyle: 'solid', //边线的样式，solid或dashed。
         enableEditing: false
     }
     for(var i=0; i<overlays.length; i++) {
     	 var polyline = new BMap.Polyline(overlays[i], styleOptions)
         map.addOverlay(polyline);	
     }
 }
 
 
 //绘制多发路段
 function displayDfld(data) {
	  var styleOptions = {
		  strokeColor:"red",    //边线颜色。
		  fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
		  strokeWeight: 10,       //边线的宽度，以像素为单位。
		  strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
		  fillOpacity: 0.8,      //填充的透明度，取值范围0 - 1。
		  strokeStyle: 'solid', //边线的样式，solid或dashed。
		  enableEditing: false
	  }
	  
	  var overlays = [];
	  var points = [];
	  for(var i=0; i<data.length; i++) {
		  var dfld = data[i].data;
		  for(var j=0; j<dfld.length; j++) {
			  var p = new BMap.Point(dfld[j].lng_jdwz, dfld[j].lat_jdwz);
			  points.push(p);
		  }
		  overlays.push(points);
		  points = [];
	  }
	  
	  for(var i=0; i<overlays.length; i++) {
		  var polyline = new BMap.Polyline(overlays[i], styleOptions)
	      map.addOverlay(polyline);	
	  }
 }
 
 