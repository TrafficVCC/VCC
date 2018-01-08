package hfut.vcc.mapping;

import java.util.*;

public interface RoadMapper {
	
	public List roadlhQuery(Map params);
	
	public List roadjdwzQuery(Map params);
	
	//查询某条路相邻两次交通事故间隔天数
	public List intervalQuery(Map params);
	
	//查询各jdwz对应的数量
	public List selectjdwz(Map params);
}
