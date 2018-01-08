package hfut.vcc.server;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.ibatis.session.SqlSession;
import org.json.*;
import hfut.vcc.util.*;
import hfut.vcc.mapping.*;

/**
 * Servlet implementation class RoadNetServlet
 */
@WebServlet("/RoadNetServlet")
public class RoadNetServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	private JSONArray js_jdwz;
	private JSONArray js_road;
	private JSONArray js_xzqh;
	private JSONArray js_sgdd;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RoadNetServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		Map<String,String> params = new HashMap<String,String>();
		//鑾峰彇鎵�鏈夊弬鏁伴泦鍚�(鐢变簬涓嶇‘瀹氬墠绔紶鏉ョ殑鏈夊摢浜涘弬鏁帮紝鎵�浠ラ渶鑾峰彇鍏舵墍鏈夊弬鏁�)
        Map<String, String[]> parameterMap=request.getParameterMap();  
        for(String key : parameterMap.keySet()){  
            params.put(key, parameterMap.get(key)[0]);
        }  
        
        JSONArray js = new JSONArray();
		try {
			if(params.get("type").equals("road")) {
				getJSONData(params);
				JSONArray js_index = new JSONArray();	//鏌ユ壘浣嶇疆
				JSONArray js_pos = new JSONArray();	//瀛樺偍缁濆浣嶇疆瀵瑰簲鐨勭粡绾害鍧愭爣
				
				for(int i=0; i<js_jdwz.length(); i++) {
					js_index.put(BinarySearch(js_road, js_jdwz.getJSONObject(i).getInt("jdwz")));
				}
				for(int i=0; i<js_index.length(); i++) {
					JSONObject obj = getCoordinate(js_road, js_jdwz.getJSONObject(i).getInt("jdwz"), js_index.getInt(i));
					obj.put("count", js_jdwz.getJSONObject(i).getInt("count"));
					obj.put("sgdd", js_jdwz.getJSONObject(i).getString("sgdd"));
					//obj.put("sgdd", js_jdwz.getJSONObject(i).getString("sgdd"));
					js_pos.put(obj);
				}
				JSONObject obj = new JSONObject();
				obj.put("road", js_road);
				obj.put("location", js_pos);
				js.put(obj);
			}
			
			else if(params.get("type").equals("sgdd")){
				getJSONData(params);
				JSONObject obj = new JSONObject();
				obj.put("road", js_road);
				obj.put("location", js_sgdd);
				js.put(obj);
			}
			else {
				getxzqhJSON(params);
				js = js_xzqh;
			}
		}
		catch(JSONException e) {
			e.printStackTrace();
		}
		
		response.setContentType("text/html;charset=utf-8");  //瑙ｅ喅鍓嶇涓枃涔辩爜
		System.out.println(js);
		PrintWriter out = response.getWriter();
		out.print(js.toString());
		
		//response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	
	private void getJSONData(Map<String,String> params) throws JSONException, IllegalArgumentException {
		SqlSession session = MyBatisUtil.getSqlSession();
		RoadNetMapper roadnet = session.getMapper(RoadNetMapper.class);
		
		List<Map<String,Object>> li_jdwz = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> li_road = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> li_sgdd = new ArrayList<Map<String,Object>>();
		li_jdwz = roadnet.selectjdwz(params);
		li_road = roadnet.selectRoad(params.get("lm"));
		li_sgdd = roadnet.selectsgdd(params);
		//System.out.println(li);
		
		js_jdwz = MySqlUtil.listToJSON(li_jdwz);
		js_road = MySqlUtil.listToJSON(li_road);
		js_sgdd = MySqlUtil.listToJSON(li_sgdd);
		
		session.close();
	}
	
	private void getxzqhJSON(Map<String,String> params) throws JSONException, IllegalArgumentException {
		SqlSession session = MyBatisUtil.getSqlSession();
		RoadNetMapper roadnet = session.getMapper(RoadNetMapper.class);
		
		List<Map<String,Object>> li_xzqh = new ArrayList<Map<String,Object>>();
		li_xzqh = roadnet.selectxzqh(params);
		//System.out.println(li);
		
		js_xzqh = MySqlUtil.listToJSON(li_xzqh);
		
		session.close();
	}
	
	//鏌ユ壘閬撹矾鏁版嵁涓窛绂荤涓�涓ぇ浜庣瓑浜巎dwz鐨勪笅鏍�(鎵句笉鍒板垯杩斿洖-1)
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
	
	//鏍规嵁缁濆浣嶇疆璁＄畻鍏剁粡绾害鍧愭爣
	public static JSONObject getCoordinate(JSONArray js_road, int jdwz, int index) throws JSONException {
		JSONObject coor = new JSONObject();
		int distance = js_road.getJSONObject(index).getInt("distance");
		
		if(index == -1) {
			coor.put("lng_jdwz", js_road.getJSONObject(index).getDouble("lng"));
			coor.put("lat_jdwz", js_road.getJSONObject(index).getDouble("lat"));
			coor.put("jdwz", jdwz);
		}
		if(jdwz == distance) {
			coor.put("lng_jdwz", js_road.getJSONObject(index).getDouble("lng"));
			coor.put("lat_jdwz", js_road.getJSONObject(index).getDouble("lat"));
			coor.put("jdwz", jdwz);
		}
		else {
			double lng1 = js_road.getJSONObject(index-1).getDouble("lng");
			double lat1 = js_road.getJSONObject(index-1).getDouble("lat");
			double d1 = js_road.getJSONObject(index-1).getDouble("distance");
			double lng2 = js_road.getJSONObject(index).getDouble("lng");
			double lat2 = js_road.getJSONObject(index).getDouble("lat");
			double d2 = js_road.getJSONObject(index).getDouble("distance");
		
			double lng = Double.compare(d1, d2) == 0 ? (lng1+lng2)/2 : (jdwz - d1)/(d2 - d1) * (lng2 - lng1) + lng1;
			double lat = Double.compare(d1, d2) == 0 ? (lat1+lat2)/2 : (jdwz - d1)/(d2 - d1) * (lat2 - lat1) + lat1;
			coor.put("jdwz", jdwz);
			coor.put("lng_jdwz", lng);
			coor.put("lat_jdwz", lat);
		}
		
		return coor;
	}
	 

}
