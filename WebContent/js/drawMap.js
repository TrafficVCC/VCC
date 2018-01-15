/**
 * 地图道路绘制相关的函数
 */

 //sgdd解析,使用for循环,闭包(注意循环中的异步问题)
	    function sgddGeocoder(data) {    	
	    	// 创建地址解析器实例
    		var myGeo = new BMap.Geocoder();
	    	
	    	for(var i=0; i<data.length; i++) {
	    		var sgdd = data[i].sgdd;
	    		(function(i) {
	    			// 将地址解析结果显示在地图上,并调整地图视野
		    		myGeo.getPoint(sgdd, function(point){
		    			if (point) {
		    				data[i].lng_sgdd = point.lng;
		    				data[i].lat_sgdd = point.lat;
		    				//alert(point.lng);
		    			}else{
		    				alert("您选择地址没有解析到结果!");
		    			}
		    		}, "合肥市");
	    	    })(i);
	    	}
	    }
	   	
	    //验证地址解析是否正确
	    function checkGeocoder(point) {
	    	var geoc = new BMap.Geocoder();  
	    	geoc.getLocation(point, function(rs){
				var addComp = rs.addressComponents;
				alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
			});        
	    }
	    
	    function displayXzqh(data) {
	    	var min = data[0].count;
	    	var max = data[data.length-1].count;
	    	var offset = 200; //偏移量
	    	
	    	for(var i=0; i<data.length; i++) {
	    		var xzqhms = data[i].xzqhms;
	    		//alert(xzqhms);
	    		var count = data[i].count;
	    		//根据count大小设置其fillOpacity深浅(归一化到0-1)
	    		var fill = parseFloat((count - min + offset))/parseFloat((max - min)) * 1.5;
	    		if(fill > 1) fill = 1.0;
		        var styleOptions = {
			            strokeColor:"blue",    //边线颜色。
			            fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
			            strokeWeight: 2,       //边线的宽度，以像素为单位。
			            //strokeOpacity: 0.6,	   //边线透明度，取值范围0 - 1。
			            fillOpacity: fill,      //填充的透明度，取值范围0 - 1。
			            strokeStyle: 'solid', //边线的样式，solid或dashed。
			            enableEditing: false
			        }
	    		console.log(fill); 
		      //  if(xzqhms!="市辖区" && xzqhms!="高速")
		        getBoundary(xzqhms, styleOptions);	
	    	}
	    	map.centerAndZoom("合肥",10);
	    }
	    
		function getBoundary(xzqhms,styleOptions) {       
			var bdary = new BMap.Boundary();
			bdary.get("合肥市"+xzqhms, function(rs){       //获取行政区域
				//map.clearOverlays();        //清除地图覆盖物       
				var count = rs.boundaries.length; //行政区域的点有多少个
				if (count === 0) {
					//alert('未能获取当前输入行政区域');
					return ;
				}
	          	var pointArray = [];
				for (var i = 0; i < count; i++) {
					var ply = new BMap.Polygon(rs.boundaries[i], styleOptions); //建立多边形覆盖物
					map.addOverlay(ply);  //添加覆盖物
					pointArray = pointArray.concat(ply.getPath());
				}    
				//map.setViewport(pointArray);    //调整视野  
				//addlabel();               
			});   
		}
	    
	    function displayRoad(data) {
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
	            strokeWeight: 6,       //边线的宽度，以像素为单位。
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
	    
	    //使用海量点类来展示点(pointCollection)
	    function displayPoint(data) {
	    	var points = [];
	    	for(var i=0; i<data.length; i++) {
	    		points.push(new BMap.Point(data[i].lng, data[i].lat));
	    	}
	    	
	        var options = {
	                size: BMAP_POINT_SIZE_NORMAL,
	                shape: BMAP_POINT_SHAPE_CIRCLE,
	                color: 'red'
	        }
	        var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
	        map.addOverlay(pointCollection);  // 添加Overlay
	    }
	    
	    
	    //使用mapv中的intensity方式绘制点，根据定义的颜色实现渐变效果
	    function displayIntensityJdwz(data) {
	    	var points = [];
	    	console.log(data);
	    	//数据需要转换成mapv的格式
	    	for(var i=0; i<data.length; i++) {
	    		points.push({
	    			geometry: {
	    				type: 'Point',
	    				coordinates: [data[i].lng_jdwz, data[i].lat_jdwz]
	    			},
	    			count: data[i].count * 30
	    		});
	    	}
	    	
	    	var dataSet = new mapv.DataSet(points);
	        var options = {
	        		zIndex: 1, // 层级
	        		size: 3,
	                gradient: {
	                    0: '#FFECEC',
	                    0.2: '#FFB5B5',
	                    0.4: '#FF7575',
	                    0.6: '#FF2D2D',
	                    0.8: '#EA0000',
	                    1.0: '#AE0000'
	                },
	                max: 100,
	                min: 0, // 最小阈值
	                draw: 'intensity',
	               
	                methods: {
	                	click: function (item) {	//添加点击事件
	                		alert(item.geometry.coordinates);
	                	}
	                }
	                
	            }
	       
	        var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
	    }
	    
	    //使用mapv中的intensity方式绘制点，根据定义的颜色实现渐变效果
	    function displayIntensitySgdd(data) {
	    	var points = [];
	    	console.log(data);
	    	//数据需要转换成mapv的格式
	    	for(var i=0; i<data.length; i++) {
	    		points.push({
	    			geometry: {
	    				type: 'Point',
	    				coordinates: [data[i].lng_sgdd, data[i].lat_sgdd]
	    			},
	    			count: data[i].count * 30
	    		});
	    	}
	    	
	    	var dataSet = new mapv.DataSet(points);
	        var options = {
	        		zIndex: 1, // 层级
	        		size: 8,
	                gradient: {
	                    0: '#FFF7FF	',
	                    0.2: '#FFD0FF',
	                    0.4: '#ffa6ff',
	                    0.6: '#FF77FF',
	                    0.8: '#FF00FF',
	                    1.0: '#D200D2'
	                },
	                max: 100,
	                min: 0, // 最小阈值
	                draw: 'intensity',
	                
	            }
	       
	        var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
	    }
	    
	    
	    //使用mapv库中的热力图来展示绝对位置
	    function displayHeatMap(data) {
	    	var points = [];
	    	//数据需要转换成mapv的格式
	    	for(var i=0; i<data.length; i++) {
	    		points.push({
	    			geometry: {
	    				type: 'Point',
	    				coordinates: [data[i].lng, data[i].lat]
	    			},
	    			count: data[i].count * 30
	    		});
	    	}
	    	
	    	var dataSet = new mapv.DataSet(points);
	        var options = {
	                size: 10,
	                gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
	                max: 100,
	                draw: 'heatmap'
	            }

	        var mapvLayer = new mapv.baiduMapLayer(map, dataSet, options);
	    }
	    
	    
	    //比较jdwz和sgdd两种方法得到的经纬度
	    function compare(data) {
	    	var count = 0;
	    	for(var i=0; i<data.length; i++) {
	    		var point1 = new BMap.Point(data[i].lng_jdwz, data[i].lat_jdwz);
	    		var point2 = new BMap.Point(data[i].lng_sgdd, data[i].lat_sgdd);
	    		var polyline = new BMap.Polyline([point1, point2], 
	    			{strokeColor:"Sienna", strokeWeight:3, strokeOpacity:0.8});
	    		
	    		var dis = map.getDistance(point1,point2);
	    		if(dis < 2000) {
	    			count++;
	    			map.addOverlay(polyline);
	    		}
	    		//map.addOverlay(polyline);
	    		//data[i].put("lng", data[i].lng_jdwz);
				//data[i].put("lat", data[i].lat_jdwz);	//默认先以jdwz作为最终的坐标
	    	}
	    	console.log("rate: "+ count/data.length);
	    }