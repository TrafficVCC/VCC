package hfut.vcc.mapping;

import java.util.*;

public interface DfldMapper {
	
	//����ĳ��·�����jdwz
	int selectMaxjdwz(String lm);
	
	//����෢·������
	void insertDfld(List params);
}
