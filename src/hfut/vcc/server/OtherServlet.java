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

import hfut.vcc.mapping.OtherMapper;
import hfut.vcc.util.MyBatisUtil;

/**
 * Servlet implementation class OtherServlet
 */
@WebServlet("/OtherServlet")
public class OtherServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public OtherServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String starty = request.getParameter("starty");
		String endy = request.getParameter("endy");
		String set = request.getParameter("set");
		Map<String,String> params = new HashMap<String,String>();
		params.put("starty", starty);
		params.put("endy", endy);
		params.put("set", set);
		
		JSONArray js = new JSONArray();
		try {
			js = getJSONData(params);
		}
		catch(JSONException e) {
			e.printStackTrace();
		}
		
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
	
	private JSONArray getJSONData(Map<String,String> params) throws JSONException, IllegalArgumentException {
		SqlSession session = MyBatisUtil.getSqlSession();
		OtherMapper other = session.getMapper(OtherMapper.class);
		
		List<Map<String,Object>> li = new ArrayList<Map<String,Object>>();
		li = other.factorQuery(params);
		
		JSONArray json = new JSONArray();
		for(Map<String,Object> map: li) {
			JSONArray arr = new JSONArray();
			for(Map.Entry<String, Object> entry: map.entrySet()) {
				String key = entry.getKey();
				Object value = entry.getValue();
				arr.put(value);
			}
			json.put(arr);
		}
		return json;
	}

}
