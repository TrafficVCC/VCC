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
		String type = request.getParameter("type");
		String[] year = request.getParameterValues("year[]");	//һ��ע���ȡǰ������ʱҪ���ֶκ����[]
		String[] month = request.getParameterValues("month[]");
		String[] lm = request.getParameterValues("lm[]");
		
		Map<String,Object> params = new HashMap<String,Object>();
		params.put("year", (String[])year);
		params.put("month", (String[])month);
		params.put("lm", (String[])lm);
		
		JSONArray js = new JSONArray();
		try {
			js = getJSONData(params);
			
		} catch(JSONException e) {
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
	
	private JSONArray getJSONData(Map<String,Object> params) throws JSONException, IllegalArgumentException {
		
		SqlSession session = MyBatisUtil.getSqlSession();
		RoadMapper road = session.getMapper(RoadMapper.class);
		
		List<Map<String,Object>> li = new ArrayList<Map<String,Object>>();
		li = road.selectRoad(params);
		
		JSONArray js = MySqlUtil.listToJSON(li);
		session.close();
		
		return js;
	}

}
