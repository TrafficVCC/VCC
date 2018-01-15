package hfut.vcc.mapping;

import java.util.List;
import java.util.Map;

public interface RoadNetMapper {
	
	public void addPoint(RoadNet point);
	
	public void deletePoint(int id);
	
	public List selectRoad(String way);
	
	//鏍规嵁lm,year,month鏌ヨ浜嬫晠鍙戠敓鐨刯dwz
    public List selectjdwz(Map params);
    
    //鎸夎鏀垮尯鍒掓煡璇�
    public List selectxzqh(Map params);
    
    //鎸塻gdd鏌ヨ
    public List selectsgdd(Map params);
    
    //查询道路jdwz和相应的经纬度坐标
    public List selectCoor(Map params);
}
