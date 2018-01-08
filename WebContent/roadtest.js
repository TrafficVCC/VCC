//画道路的图
var data;
data = lh;
//console.log(data);


//画事故数量大于num的lh的饼图
gragh = "road"+"pie";

var num;
num = 300;
var dataset = [];
data.forEach(function(d, i){
    if(d.sgcount >= num)
        dataset.push([d.lh, d.sgcount]);
});
//小于300的lh归于其他
dataset.push(["其他", num]);  

//饼状图
drawPie(dataset, gragh, w, h);

var num2;
num2 = 150;
var dataset = [];
data.forEach(function(d, i){
    if(d.sgcount <= num && d.sgcount >= num2)
        dataset.push([d.lh, d.sgcount]);
});
drawPie2(dataset, "otherpie1", 300, 300);

num = 150;
num2= 100;
var dataset = [];
data.forEach(function(d, i){
    if(d.sgcount <= num && d.sgcount >= num2)
        dataset.push([d.lh, d.sgcount]);
});
drawPie2(dataset, "otherpie2", 300, 300);








