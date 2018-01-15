//重置按钮
function clickbtnA4(){
	
	//时间恢复三年
	window.years = window.originYears;
	window.roadList = window.originRoads;
	updatecontentA();
	updatecontentB();
	updatecontentC();
	updatecontentD();
	updatecontentE();
	
	
}
//点击堆栈图区域
function clickStackArea(syear){
	window.years = syear;
	updatecontentA();
	updatecontentB();
	updatecontentC();
	updatecontentD();
	updatecontentE();

}


function clickPie(road){
	window.road=road;
	window.roadList=[road];
	updatecontentA();
	updatecontentC();
	updatecontentD();
	updatecontentE();

}

function clickAttrRect()
{
	updatecontentC();
}