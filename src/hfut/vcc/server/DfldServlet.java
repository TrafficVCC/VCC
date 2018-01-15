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
	    	JSONArray js_dfld = new JSONArray();	//�����¹ʶ෢·��    	
	    	getRoad(lm);	//�õ�ĳ��·�ľ�γ�Ⱥ����jdwz
	    	//��õ�·��������
			int max_dist = js_road.getJSONObject(js_road.length()-1).getInt("distance");	
			System.out.println(max_jdwz);
			//�����ϵ��(��jdwzλ��ӳ�䵽��·�ķ�Χ��)
			double rate = (double)max_dist / max_jdwz;
			
			for(int i=0; i<dfldArray.size(); i++) {
				
				String[] dfld = dfldArray.get(i);	//ÿ���෢·��
				JSONObject obj_dfld = new JSONObject();	 //ÿ���෢·��[{"id": 1, "data":[{"lng":33,"lat":66},{}]}, { }]
				obj_dfld.put("id", i+1);	//�෢·��id
				JSONArray data_dfld = new JSONArray();
				int start = 0, end = 0;
				int ejdwz = 0, eindex = 0;	//����������jdwz��index,��Ϊ������Ҫ������ȥ
				
				for(int j=0; j<dfld.length; j++) {
					int jdwz = Integer.parseInt(dfld[j]) * 10;
					int jdwz2 = (int)Math.round(jdwz * rate);	//ӳ����jdwz
					System.out.println(jdwz+" "+jdwz2);
					int index= BinarySearch(js_road, jdwz2);
					System.out.println("index: " + index);		
					if(j==0) {
						start = index;	 //����෢·����ʼ�������
						JSONObject obj = getCoordinate(js_road, jdwz2, index);
						data_dfld.put(obj);
					}
					else {
						end = index;	//����෢·�ν����������
						eindex = index;
						ejdwz = jdwz2;
					}	
				}
				
				for(int k=start; k<end; k++) {
					//��roadnet�������õ�·λ�ڶ෢·��֮���λ�õľ�γ��
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
				
				obj_dfld.put("data", data_dfld);	//һ���෢·��
				js_dfld.put(obj_dfld);		//�������ж෢·��
			}
			
			JSONObject obj = new JSONObject();
			obj.put("road", js_road);
			obj.put("dfld", js_dfld);
			js.put(obj);	//ͬʱ����������·���ݺͶ෢·������
	    	
	    } catch(JSONException e) {
	    	e.printStackTrace();
	    }
	    
	    response.setContentType("text/html;charset=utf-8");  //��ֹǰ����������
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
	
	
	//�õ���·����
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
	
	//���ֲ���
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
		
		return (left < js.length()) ? left : js.length()-1;		//������Χ�������һ��
	}

}
