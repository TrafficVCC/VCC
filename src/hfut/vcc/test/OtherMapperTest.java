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
	
	private static JSONArray js_road;
	private static JSONArray js_jdwz;
	
	public static void getJSONData(Map<String,String> params) throws JSONException, IllegalArgumentException {
		SqlSession session = MyBatisUtil.getSqlSession();
		RoadNetMapper road = session.getMapper(RoadNetMapper.class);
		
		List<Map<String,Object>> li_road = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> li_jdwz = new ArrayList<Map<String,Object>>();
		li_road = road.selectRoad(params.get("lm"));
		li_jdwz = road.selectjdwz(params);
		//System.out.println(li);
		
		js_road = MySqlUtil.listToJSON(li_road);
		js_jdwz = MySqlUtil.listToJSON(li_jdwz);
		session.close();
	}
	
	//查找道路数据中距离第一个大于等于jdwz的下标(找不到则返回-1)
	public static int BinarySearch(JSONArray js, int jdwz) throws JSONException {
		int left = 0;
		int right = js.length() - 1;
	
		while(left <= right) {
			int middle = left + ((right-left) >> 1);
			JSONObject obj = js.getJSONObject(middle);
			
			if(obj.getInt("distance") >= jdwz) {
				right = middle - 1;
			}
			else {
				left = middle + 1;
			}
		}
		
		return (left < js.length()) ? left : -1;
	}
	
	//根据绝对位置计算其经纬度坐标
	public static JSONObject getCoordinate(JSONArray js_road, int jdwz, int index) throws JSONException {
		JSONObject coor = new JSONObject();
		int distance = js_road.getJSONObject(index).getInt("distance");
		
		if(index == -1) {
			coor.put("lng", js_road.getJSONObject(index).getDouble("lng"));
			coor.put("lat", js_road.getJSONObject(index).getDouble("lat"));
			coor.put("jdwz", jdwz);
		}
		if(jdwz == distance) {
			coor.put("lng", js_road.getJSONObject(index).getDouble("lng"));
			coor.put("lat", js_road.getJSONObject(index).getDouble("lat"));
			coor.put("jdwz", jdwz);
		}
		else {
			double lng1 = js_road.getJSONObject(index-1).getDouble("lng");
			double lat1 = js_road.getJSONObject(index-1).getDouble("lat");
			double d1 = js_road.getJSONObject(index-1).getDouble("distance");
			double lng2 = js_road.getJSONObject(index).getDouble("lng");
			double lat2 = js_road.getJSONObject(index).getDouble("lat");
			double d2 = js_road.getJSONObject(index).getDouble("distance");
			
			/*
			if(Math.abs(lng2 - lng1) < 0.00001 && Math.abs(lat2 - lat1) < 0.00001) {
				coor.put("lng", (lng1+lng2)/2);
				coor.put("lat", (lat1+lat2)/2);
			}
			else if(Math.abs(lng2 - lng1) < 0.00001) {
				double lat = (jdwz - d1)/(d2 - d1) * (lat2 - lat1) + lat1;
				coor.put("lng", (lng1+lng2)/2);
				coor.put("lat", lat);
			}
			else if(Math.abs(lat2 - lat1) < 0.00001) {
				double lng = (jdwz - d1)/(d2 - d1) * (lng2 - lng1) + lng1;
				coor.put("lng", lng);
				coor.put("lat", (lat1+lat2)/2);
			}
			*/
		
			double lng = Double.compare(d1, d2) == 0 ? (lng1+lng2)/2 : (jdwz - d1)/(d2 - d1) * (lng2 - lng1) + lng1;
			double lat = Double.compare(d1, d2) == 0 ? (lat1+lat2)/2 : (jdwz - d1)/(d2 - d1) * (lat2 - lat1) + lat1;
			coor.put("lng", lng);
			coor.put("lat", lat);
			coor.put("jdwz", jdwz);
		}
		
		return coor;
	}
	 
	
	public static void main(String[] args) throws IOException {
		
		Map<String,String> params = new HashMap<String,String>();
		params.put("year", "2016");
		params.put("month", "12");
		params.put("lm", "徽州大道");
		
		JSONArray js_index = new JSONArray();
		JSONArray js_point = new JSONArray();
		try {
			getJSONData(params);
			for(int i=0; i<js_jdwz.length(); i++) {
				js_index.put(BinarySearch(js_road, js_jdwz.getJSONObject(i).getInt("jdwz")));
			}
			for(int i=0; i<js_index.length(); i++) {
				JSONObject obj = getCoordinate(js_road, js_jdwz.getJSONObject(i).getInt("jdwz"), js_index.getInt(i));
				js_point.put(obj);
			}
		}
		catch(JSONException e) {
			e.printStackTrace();
		}
		
		System.out.println(js_point);
	}
	
}
