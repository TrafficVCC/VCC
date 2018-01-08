package hfut.vcc.mapping;

import java.util.List;
import java.util.Map;

public interface RoadNetMapper {
	
	public void addPoint(RoadNet point);
	
	public void deletePoint(int id);
	
	public List selectRoad(String way);
	
	//根据lm,year,month查询事故发生的jdwz
    public List selectjdwz(Map params);
    
    //按行政区划查询
    public List selectxzqh(Map params);
    
    //按sgdd查询
    public List selectsgdd(Map params);
}
