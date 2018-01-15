package hfut.vcc.server;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.ibatis.session.SqlSession;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import hfut.vcc.mapping.DfldMapper;
import hfut.vcc.mapping.RoadNetMapper;
import hfut.vcc.util.MyBatisUtil;
import hfut.vcc.util.MySqlUtil;

/**
 * Servlet implementation class DfldServlet
 */
@WebServlet("/DfldServlet")
public class DfldServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private JSONArray js_road;
	private int max_jdwz;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DfldServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String lm = request.getParameter("lm");
		String[] data = request.getParameterValues("data[]");
	    
	    List<String[]> dfldArray = new ArrayList<String[]>();
	    for(int i=0; i<data.length; i++) {
	    	String[] temp = null;
	    	if(data[i].length()!=0) {
	    		temp = data[i].split("-");
	    	}
	    	else {
	    		temp = new String[0];
	    	}
	    	dfldArray.add(temp);
	    	System.out.println(temp.length);
	    }
	    
	    JSONArray js = new JSONArray();
	    try {
	    	JSONArray js_dfld = new JSONArray();	//保存事故多发路段    	
	    	getRoad(lm);	//得到某条路的经纬度和最大jdwz
	    	//获得道路的最大距离
			int max_dist = js_road.getJSONObject(js_road.length()-1).getInt("distance");	
			System.out.println(max_jdwz);
			//换算关系比(将jdwz位置映射到道路的范围内)
			double rate = (double)max_dist / max_jdwz;
			
			for(int i=0; i<dfldArray.size(); i++) {
				
				String[] dfld = dfldArray.get(i);	//每个多发路段
				JSONObject obj_dfld = new JSONObject();	 //每个多发路段[{"id": 1, "data":[{"lng":33,"lat":66},{}]}, { }]
				obj_dfld.put("id", i+1);	//多发路段id
				JSONArray data_dfld = new JSONArray();
				int start = 0, end = 0;
				int ejdwz = 0, eindex = 0;	//保存结束点的jdwz和index,因为结束点要最后加上去
				
				for(int j=0; j<dfld.length; j++) {
					int jdwz = Integer.parseInt(dfld[j]) * 10;
					int jdwz2 = (int)Math.round(jdwz * rate);	//映射后的jdwz
					System.out.println(jdwz+" "+jdwz2);
					int index= BinarySearch(js_road, jdwz2);
					System.out.println("index: " + index);		
					if(j==0) {
						start = index;	 //保存多发路段起始点的索引
						JSONObject obj = getCoordinate(js_road, jdwz2, index);
						data_dfld.put(obj);
					}
					else {
						end = index;	//保存多发路段结束点的索引
						eindex = index;
						ejdwz = jdwz2;
					}	
				}
				
				for(int k=start; k<end; k++) {
					//在roadnet中搜索该道路位于多发路段之间的位置的经纬度
					double jdwz = js_road.getJSONObject(k).getInt("distance");
					double lng_jdwz = js_road.getJSONObject(k).getDouble("lng");
					double lat_jdwz = js_road.getJSONObject(k).getDouble("lat");
					JSONObject obj = new JSONObject();
					obj.put("jdwz", jdwz);
					obj.put("lng_jdwz", lng_jdwz);
					obj.put("lat_jdwz", lat_jdwz);
					data_dfld.put(obj);
				}
				JSONObject obj = getCoordinate(js_road, ejdwz, eindex);
				data_dfld.put(obj);
				
				obj_dfld.put("data", data_dfld);	//一条多发路段
				js_dfld.put(obj_dfld);		//保存所有多发路段
			}
			
			JSONObject obj = new JSONObject();
			obj.put("road", js_road);
			obj.put("dfld", js_dfld);
			js.put(obj);	//同时保存整条道路数据和多发路段数据
	    	
	    } catch(JSONException e) {
	    	e.printStackTrace();
	    }
	    
	    response.setContentType("text/html;charset=utf-8");  //防止前端中文乱码
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
	
	
	//得到道路数据
	private void getRoad(String lm) throws JSONException, IllegalArgumentException {
		SqlSession session = MyBatisUtil.getSqlSession();
		RoadNetMapper roadnet = session.getMapper(RoadNetMapper.class);
		DfldMapper dfld =session.getMapper(DfldMapper.class);
		
		List<Map<String,Object>> li_road = new ArrayList<Map<String,Object>>();
		max_jdwz = dfld.selectMaxjdwz(lm);
		li_road = roadnet.selectRoad(lm);
		js_road = MySqlUtil.listToJSON(li_road);
		
		System.out.println(js_road);
		session.close();
	}
	
	
	public static JSONObject getCoordinate(JSONArray js_road, int jdwz, int index) throws JSONException {
		JSONObject coor = new JSONObject();
		int distance = js_road.getJSONObject(index).getInt("distance");
		
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
	
	//二分查找
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
		
		return (left < js.length()) ? left : js.length()-1;		//超出范围返回最后一个
	}

}
