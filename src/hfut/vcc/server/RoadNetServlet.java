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
	private JSONArray js_coor;
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
		String type = request.getParameter("type");
		String[] year = request.getParameterValues("year[]");	//一定注意获取前端数组时要在字段后加上[]
		String[] month = request.getParameterValues("month[]");
		String lm = request.getParameter("lm");
		
		Map<String,Object> params = new HashMap<String,Object>();
		params.put("year", (String[])year);
		params.put("month", (String[])month);
		params.put("lm", lm);
        
        JSONArray js = new JSONArray();
		try {
				if(type.equals("road")) {	//如果type为road表示坐标还没计算
					
					getJdwzData(params);
					JSONArray js_index = new JSONArray();	//每个jdwz的索引,位于roadnet中哪两个点之间
					JSONArray js_pos = new JSONArray();		//计算出的jdwz对应的经纬度
					//获得道路的最大距离
					int max_dist = js_road.getJSONObject(js_road.length()-1).getInt("distance");
					int max_jdwz = js_jdwz.getJSONObject(js_jdwz.length()-1).getInt("jdwz");
					System.out.println(max_jdwz);
					//int max_jdwz = 2571;
					//换算关系比(将jdwz位置映射到道路的范围内)
					double rate = (double)max_dist / max_jdwz;
					
					for(int i=0; i<js_jdwz.length(); i++) {
						int jdwz = js_jdwz.getJSONObject(i).getInt("jdwz");
						int jdwz2 = (int)Math.round(jdwz * rate);	//映射后的jdwz
						js_jdwz.getJSONObject(i).put("jdwz2", jdwz2);
						System.out.println(jdwz+" "+jdwz2);
						js_index.put(BinarySearch(js_road, jdwz2));
					}
					for(int i=0; i<js_index.length(); i++) {
						JSONObject obj = getCoordinate(js_road, js_jdwz.getJSONObject(i).getInt("jdwz2"), js_index.getInt(i));
						obj.put("count", js_jdwz.getJSONObject(i).getInt("count"));
						obj.put("jdwz", js_jdwz.getJSONObject(i).getInt("jdwz"));
						js_pos.put(obj);
					}
					JSONObject obj = new JSONObject();
					obj.put("road", js_road);
					obj.put("location", js_pos);
					js.put(obj);
				}
				
				else if(type.equals("coor")) {	//type为coor,则表示坐标已计算好,直接查询即可
					getCoorData(params);
					JSONObject obj = new JSONObject();
					obj.put("road", js_road);
					obj.put("location", js_coor);
					js.put(obj);
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
	
	private void getCoorData(Map<String,Object> params) throws JSONException, IllegalArgumentException {
		SqlSession session = MyBatisUtil.getSqlSession();
		RoadNetMapper roadnet = session.getMapper(RoadNetMapper.class);
		
		List<Map<String,Object>> li_coor = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> li_road = new ArrayList<Map<String,Object>>();
		li_coor = roadnet.selectCoor(params);
		li_road = roadnet.selectRoad((String)params.get("lm"));
		
		js_coor = MySqlUtil.listToJSON(li_coor);
		js_road = MySqlUtil.listToJSON(li_road);
		
	}
	
	private void getJdwzData(Map<String,Object> params) throws JSONException, IllegalArgumentException {
		SqlSession session = MyBatisUtil.getSqlSession();
		RoadNetMapper roadnet = session.getMapper(RoadNetMapper.class);
		
		List<Map<String,Object>> li_jdwz = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> li_road = new ArrayList<Map<String,Object>>();
		li_jdwz = roadnet.selectjdwz(params);
		li_road = roadnet.selectRoad((String)params.get("lm"));
		//System.out.println(li);
		
		js_jdwz = MySqlUtil.listToJSON(li_jdwz);
		js_road = MySqlUtil.listToJSON(li_road);
		
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
			coor.put("jdwz2", jdwz);
		}
		if(jdwz == distance) {
			coor.put("lng_jdwz", js_road.getJSONObject(index).getDouble("lng"));
			coor.put("lat_jdwz", js_road.getJSONObject(index).getDouble("lat"));
			coor.put("jdwz2", jdwz);
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
			coor.put("jdwz2", jdwz);
			coor.put("lng_jdwz", lng);
			coor.put("lat_jdwz", lat);
		}
		
		return coor;
	}
	 

}
