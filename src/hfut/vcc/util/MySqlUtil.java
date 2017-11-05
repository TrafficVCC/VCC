package hfut.vcc.util;

import java.util.*;

import org.apache.ibatis.session.SqlSession;
import org.json.*;

public class MySqlUtil {
	
	//类型到其count数量的映射
	private static final Map<String, Integer> typeTonum = new HashMap<String, Integer>();
	static {
		typeTonum.put("year", 1);
		typeTonum.put("month", 12);
		typeTonum.put("quarter", 4);
		typeTonum.put("week", 7);
		typeTonum.put("week2", 53);
	}
	
	
	/*list转换为JSONArray*/
	public static JSONArray listToJSON(List<Map<String,Object>> list) {
		JSONArray json = new JSONArray();
		for(Map<String,Object> map: list) {
			JSONObject obj = new JSONObject();
			for(Map.Entry<String, Object> entry: map.entrySet()) {
				String key = entry.getKey();
				Object value = entry.getValue();
				try {
					obj.put(key, value);
				} 
				catch(JSONException e) {
					e.printStackTrace();
				}
			}
			json.put(obj);
		}
		return json;
	}
	
	/*合并具有相同key值的(相同年份合并到一个count数组中),无记录补0*/
	public static JSONArray combineJSON(JSONArray array,Map<String,String> params) 
			throws JSONException,IndexOutOfBoundsException {
		String starty = params.get("starty");
		String endy = params.get("endy");
		String type = params.get("type");
		JSONArray result = new JSONArray();
		//注:HashMap内部是无序的,应用LinkedHashMap
		Map<Object, List> map = new LinkedHashMap<>();
		int num = typeTonum.get(type);
		//初始化map,count里根据类型填充0
		for(int i=Integer.parseInt(starty); i<=Integer.parseInt(endy);i++) {
			List li = new ArrayList<>();
			for(int j=0; j<num; j++) {
				li.add(0);
			}
			map.put(i, li);
		}
		
		for(int i=0; i<array.length(); i++) {
			JSONObject js = array.getJSONObject(i);
			Object key = js.get("year");
			Object index = js.get(type);	//在count中的位置,若是按月查询,则对应第几个月
			if(type.equals("year")) {
				map.get(key).set(0,js.get("count"));
			}
			else {
				map.get(key).set((int)index-1,js.get("count"));
			}
		}
		
		Iterator<Object> it = map.keySet().iterator();  
        while (it.hasNext()) {
        	Object key = it.next();
        	JSONObject obj = new JSONObject(true);
        	obj.put("year", key);
        	obj.put("count", map.get(key));
        	result.put(obj);
        }
		return result;
	}
	
}
