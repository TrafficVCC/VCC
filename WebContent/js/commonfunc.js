

function findhot(data ,threod)
{
	var flag = false;
	var s;
	var ss = [];
	if(data[0]>=threod)
	{
		flag =true;
		s="0-";
	}   
	for (var i = 1; i < data.length; i++) {  
	    if(flag && data[i]<threod)
	    {
	    	s+=i;
	    	console.log(s);
	    	ss.push(s);
	    	flag = false;
	    }
	    if(!flag && data[i]>=threod){
	    	 s=i+"-";
	    	 flag = true;
	    }
	}
	if(data[data.length-1]>=threod)
	{
		s+=data.length;
    	console.log(s);
    	ss.push(s);
    	flag = false;
	}   
	return ss;
}
