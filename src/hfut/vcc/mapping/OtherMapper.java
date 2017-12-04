package hfut.vcc.mapping;

import java.util.*;

public interface OtherMapper {
	
	public List clisgQuery();
	
	public List dcsgQuery();
	
	public List rdyyflQuery();
	
	public List sgxtQuery();
	
	public List tqQuery();
	
	public List xzqhQuery();
	
	//其他因素查询(tq,cljsg等)
	public List factorQuery(Map params);
	
	//根据lm,year,month查询事故发生的jdwz
	public List selectjdwz(Map params);
	
	//查询RoadNet表中某条路的数据
	public List selectRoadNet(Map way);
}
