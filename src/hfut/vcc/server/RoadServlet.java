package hfut.vcc.server;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.ibatis.session.SqlSession;
import org.json.*;
import java.util.*;

import hfut.vcc.mapping.RoadMapper;
import hfut.vcc.util.*;

/**
 * Servlet implementation class RoadServlet
 */
@WebServlet("/RoadServlet")
public class RoadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RoadServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see Servlet#init(ServletConfig)
	 */
	public void init(ServletConfig config) throws ServletException {
		// TODO Auto-generated method stub
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
		RoadMapper road = session.getMapper(RoadMapper.class);
		
		List<Map<String,Object>> li = new ArrayList<Map<String,Object>>();
		String type = params.get("type");
		if(type.equals("lh")) {
			li = road.roadlhQuery(params);
		}
		else if(type.equals("jdwz")) {
			li = road.roadjdwzQuery(params);
		}
		else if(type.equals("jysg_jdwz")) {
			li = road.selectjdwz(params);
		}
		else if(type.equals("interval")) {
			li = road.intervalQuery(params);
		}
		else {
			throw new IllegalArgumentException ("Invalid type");
		}
		
		JSONArray js = MySqlUtil.listToJSON(li);
		session.close();
		
		return js;
	}

}
