package hfut.vcc.mapping;

import java.util.*;

public interface OtherMapper {
	
	public List clisgQuery();
	
	public List dcsgQuery();
	
	public List rdyyflQuery();
	
	public List sgxtQuery();
	
	public List tqQuery();
	
	public List xzqhQuery();

	public List factorQuery(Map params);
	
	public List factorCountQuery(Map params);
	
	public List factorQuery2(Map params);
}
