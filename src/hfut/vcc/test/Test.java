package hfut.vcc.test;

import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import hfut.vcc.util.*;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import java.util.*;
import hfut.vcc.mapping.*;
import org.json.*;

public class Test {
	
	public static void main(String[] args) throws IOException {
		
		SqlSession session = MyBatisUtil.getSqlSession();
		
//		String statement = "hfut.vcc.mapping.userMapper.getYear";	//映射sql的标识字符串		
//		List user = session.selectList(statement);
		TimeMapper time = session.getMapper(TimeMapper.class);
		RoadMapper road = session.getMapper(RoadMapper.class);
		
		Map<String,String> params = new HashMap<String,String>();
		params.put("year", "2006");
		params.put("month", "0");
		List res = time.dayQueryByYear(params);
		System.out.println(res);
		try {
			JSONArray js = MySqlUtil.listToJSON(res);
			//js = MySqlUtil.combineJSON(js, params);
			System.out.println(js);
			
			  //将json字符串写入文件
		    try (FileWriter file = new FileWriter("test.json")) {

	            file.write(js.toString());
	            file.flush();

	        } catch (IOException e) {
	            e.printStackTrace();
	        }
		}
		catch(Exception e) {
			e.printStackTrace();
		}
		
		session.close();
	}
}
