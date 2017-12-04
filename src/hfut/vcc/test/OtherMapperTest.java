package hfut.vcc.test;

import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.Reader;
import hfut.vcc.util.*;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import java.util.*;
import hfut.vcc.mapping.*;
import org.json.*;

public class OtherMapperTest {
	
	public static JSONArray getJSONData(Map<String,String> params) throws JSONException, IllegalArgumentException {
		SqlSession session = MyBatisUtil.getSqlSession();
		RoadNetMapper other = session.getMapper(RoadNetMapper.class);
		
		List<Map<String,Object>> li = new ArrayList<Map<String,Object>>();
		li = other.selectRoad(params.get("lm"));
		//System.out.println(li);
		
		JSONArray js = MySqlUtil.listToJSON(li);
		session.close();
		
		return js;
	}

	
	public static void main(String[] args) throws IOException {
		
		Map<String,String> params = new HashMap<String,String>();
		params.put("year", "2016");
		params.put("month", "12");
		params.put("lm", "徽州大道");
		
		JSONArray js = new JSONArray();
		try {
			js = getJSONData(params);
		}
		catch(JSONException e) {
			e.printStackTrace();
		}
		
		System.out.println(js);
	}
	
}
