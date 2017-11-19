package hfut.vcc.server;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.json.*;
import hfut.vcc.util.*;
import hfut.vcc.mapping.*;

/**
 * Servlet implementation class LoadRoadServlet
 */
@WebServlet("/LoadRoadServlet")
public class LoadRoadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoadRoadServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String way = request.getParameter("data");
		
		JSONArray js = new JSONArray();
		try {
			js = getJSONData(way);
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
	
	private JSONArray getJSONData(String way) throws JSONException {
		
		SqlSession session = MyBatisUtil.getSqlSession();
		RoadNetMapper road = session.getMapper(RoadNetMapper.class);
		
		List<Map<String,Object>> li = new ArrayList<Map<String,Object>>();
		li = road.selectRoad(way);
		
		JSONArray js = MySqlUtil.listToJSON(li);
		session.close();
		
		return js;
	}

}
