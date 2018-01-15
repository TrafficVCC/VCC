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

import hfut.vcc.mapping.TimeMapper;
import hfut.vcc.util.*;

/**
 * Servlet implementation class TimeServlet
 */
@WebServlet("/TimeServlet")
public class TimeServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public TimeServlet() {
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
		String type = request.getParameter("type");
		String[] year = request.getParameterValues("year[]");
		String[] set = request.getParameterValues("set[]"); 
		System.out.println("lm " + set);
		Map<String,Object> params = new HashMap<String,Object>();
		params.put("type", type);
		params.put("year", (String[])year);
		params.put("set", (String[])set);
		
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
	
	private JSONArray getJSONData(Map<String,Object> params) throws JSONException, IllegalArgumentException {
		
		SqlSession session = MyBatisUtil.getSqlSession();
		TimeMapper time = session.getMapper(TimeMapper.class);
		
		List<Map<String,Object>> li = new ArrayList<Map<String,Object>>();
		String type = (String)params.get("type");
		if(type.equals("year")) {
			li =  time.yearQuery(params);
		}
		else if(type.equals("month")) {
			li = time.monthQuery(params);
		}
		
		JSONArray js = MySqlUtil.listToJSON(li);
		js = MySqlUtil.combineJSON(js, params);
		session.close();
		
		return js;
	}

}
