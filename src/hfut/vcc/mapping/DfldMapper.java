package hfut.vcc.mapping;

import java.util.*;

public interface DfldMapper {
	
	//查找某条路的最大jdwz
	int selectMaxjdwz(String lm);
	
	//插入多发路段数据
	void insertDfld(List params);
}
