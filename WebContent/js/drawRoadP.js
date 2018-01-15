//data
//divId
//roads

function drawRoadP(data, divId,func,roads){

	var option1 = {
	    title : {
	        text: '道路发生事故数量饼图',
//	        subtext: '',
	        x:'center'
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        orient: 'vertical',
	        left: 'left',
	        data: roads
	    },
	    series : [
	        {
	            name: '',
	            type: 'pie',
	            radius : '55%',
	            center: ['50%', '60%'],
	            selectedMode: 'single',
		        selectedOffset: 10,
		        clockwise: true,
	            data:data,
	            itemStyle: {
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
	            }
	        }
	    ]
	};
	
	var myChart1 = echarts.init(document.getElementById(divId));
	myChart1.setOption(option1);
	myChart1.on('click', function (params) {
		func(params.name);
	});
	
	
}
