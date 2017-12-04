package hfut.vcc.mapping;

import java.util.*;

public interface TimeMapper {
	
	public List yearQuery(Map params);
	
	public List monthQuery(Map params);
	
	public List weekQuery(Map params);
	
	public List quarterQuery(Map params);
	
	//按天查询,固定年份和月份
	public List dayQuery(Map params);
	
	//按天查询，年份固定
	public List dayQueryByYear(Map params);
	
	//每年每个星期发生事故数(1~53)
	public List week2Query(Map params);
}
