//定义json数组存储道路数据
var road = {"way":"", "data":[]};
var flag = false;
var overlays = [];
var m = new Map();	//polyline和ld的映射关系
var ld = 0;

//创建地图
var map = new BMap.Map("map", {enableMapClick:false});
map.centerAndZoom("合肥",15);
map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

var polylineMenuItem = [
	{
		text:'编辑',
		callback:function(e,ee,overlay){overlay.enableEditing();}
	},
	{
		text:'完成',
		callback:function(e,ee,overlay){
			overlay.disableEditing();
		}
	},
	{
		text:'删除',
		callback:function(e,ee,overlay){
			var index = m.get(overlay);
			//alert(index);
			map.removeOverlay(overlay);
			overlays.splice(index,1);	//删除overlays中指定索引项
		}
	}
];

var styleOptions = {
	strokeColor:"red",    //边线颜色。
	fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
	strokeWeight: 6,       //边线的宽度，以像素为单位。
	strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
	fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
	strokeStyle: 'solid', //边线的样式，solid或dashed。
	enableEditing: false
}

//创建鼠标绘制工具
var myDrawingManagerObject = new BMapLib.DrawingManager(map, {
	isOpen: false,
	enableDrawingTool: true,
	enableCalculate: false,
	drawingToolOptions: {
		anchor: BMAP_ANCHOR_TOP_LEFT,
		offset: new BMap.Size(5, 5),
		drawingModes : [
			BMAP_DRAWING_POLYLINE,
			BMAP_DRAWING_MARKER
		]
	},
	polylineOptions: styleOptions
});

//绘制polyline完成后，派发的事件接口
myDrawingManagerObject.addEventListener("polylinecomplete", function(e,overlay) {
    overlays.push(overlay);
	overlay.setStrokeColor("blue");
	m.set(overlay,ld);
	ld = ld + 1;
	addPolylineEvent(overlay);
});

//polyline鼠标右击事件,弹出菜单项
function addPolylineEvent(overlay) {
	overlay.addEventListener("rightclick", function (e) {
		var polylineMenu = new BMap.ContextMenu();
		for(var i=0; i < polylineMenuItem.length; i++){
			polylineMenu.addItem(new BMap.MenuItem(polylineMenuItem[i].text,polylineMenuItem[i].callback.bind(overlay)));
		}
		overlay.addContextMenu(polylineMenu);
	});
}

map.addEventListener("click",function(e){
	if(flag) {
		//console.log(e.point.lng + "," + e.point.lat);
		var li = "<li>("+e.point.lng+" , "+e.point.lat+")</li>";
		$("#list").append(li);
	}
});

map.addEventListener("rightclick",function(e) {
	flag = false;
});

