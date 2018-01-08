package hfut.vcc.util;

import java.util.*;

import org.apache.ibatis.session.SqlSession;
import org.json.*;

public class MySqlUtil {
	
	//绫诲瀷鍒板叾count鏁伴噺鐨勬槧灏�
	private static final Map<String, Integer> typeTonum = new HashMap<String, Integer>();
	static {
		typeTonum.put("year", 1);
		typeTonum.put("month", 12);
		typeTonum.put("quarter", 4);
		typeTonum.put("week", 7);
		typeTonum.put("week2", 53);
	}
	
	
	/*list杞崲涓篔SONArray*/
	public static JSONArray listToJSON(List<Map<String,Object>> list) {
		JSONArray json = new JSONArray();
		for(Map<String,Object> map: list) {
			JSONObject obj = new JSONObject(true);
			for(Map.Entry<String, Object> entry: map.entrySet()) {
				String key = entry.getKey();
				Object value = entry.getValue();
//				System.out.println(key + "," +value);
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
	
	/*鍚堝苟鍏锋湁鐩稿悓key鍊肩殑(鐩稿悓骞翠唤鍚堝苟鍒颁竴涓猚ount鏁扮粍涓�),鏃犺褰曡ˉ0*/
	public static JSONArray combineJSON(JSONArray array,Map<String,String> params) 
			throws JSONException,IndexOutOfBoundsException {
		String starty = params.get("starty");
		String endy = params.get("endy");
		String type = params.get("type");
		JSONArray result = new JSONArray();
		//娉�:HashMap鍐呴儴鏄棤搴忕殑,搴旂敤LinkedHashMap
		Map<Object, List> map = new LinkedHashMap<>();
		int num = typeTonum.get(type);
		//鍒濆鍖杕ap,count閲屾牴鎹被鍨嬪～鍏�0
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
			Object index = js.get(type);	//鍦╟ount涓殑浣嶇疆,鑻ユ槸鎸夋湀鏌ヨ,鍒欏搴旂鍑犱釜鏈�
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
