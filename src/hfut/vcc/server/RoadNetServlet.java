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
		//获取所有参数集合(由于不确定前端传来的有哪些参数，所以需获取其所有参数)
        Map<String, String[]> parameterMap=request.getParameterMap();  
        for(String key : parameterMap.keySet()){  
            params.put(key, parameterMap.get(key)[0]);
        }  
        
        JSONArray js = new JSONArray();
		try {
			if(params.get("type").equals("road")) {
				getJSONData(params);
				js = js_road;
			}
			else {
				getxzqhJSON(params);
				js = js_xzqh;
			}
			
		}
		catch(JSONException e) {
			e.printStackTrace();
		}
		
		response.setContentType("text/html;charset=utf-8");  //解决前端中文乱码
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
		li_jdwz = roadnet.selectjdwz(params);
		li_road = roadnet.selectRoad(params.get("lm"));
		//System.out.println(li);
		
		js_jdwz = MySqlUtil.listToJSON(li_jdwz);
		js_road = MySqlUtil.listToJSON(li_road);
		
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

}
