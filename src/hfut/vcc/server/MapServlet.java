package hfut.vcc.server;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

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
 * Servlet implementation class MapServlet
 */
@WebServlet("/MapServlet")
public class MapServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public MapServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String road = request.getParameter("data");
		try {
			JSONObject js = new JSONObject(road);
			addRoad(js);
			
			//将json字符串写入文件
			try (FileWriter file = new FileWriter(js.getString("way")+".json")) {
				JsonFormatUtil tool = new JsonFormatUtil();
				file.write(tool.formatJson(js.toString()));
				file.flush();

			} catch (IOException e) {
				e.printStackTrace();
			}
			
			response.setContentType("text/html;charset=utf-8");  //解决前端中文乱码
			System.out.println(js);
			PrintWriter out = response.getWriter();
			out.print(js);		
		} 
		catch(Exception e) {
			e.printStackTrace();
		}
		//response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	
	private void addRoad(JSONObject js) throws JSONException {
		String way = js.getString("way");
		JSONArray data = js.getJSONArray("data");
		
		for(int i=0; i<data.length(); i++) {
			JSONObject d = data.getJSONObject(i);
			int ld = d.getInt("ld");
			JSONArray points = d.getJSONArray("points");
			
			for(int j=0; j<points.length(); j++) {
				JSONObject p = points.getJSONObject(j);
				double lng = p.getDouble("lng");
				double lat = p.getDouble("lat");
				double dist = p.getDouble("dist");
				RoadNet point = new RoadNet();
				point.setLng(lng);
				point.setLat(lat);
				point.setDist(dist);
				point.setWay(way);
				point.setLd(ld);
				addPoint(point);
			}
		}
	}
	
	private void addPoint(RoadNet point) {
		SqlSession session = MyBatisUtil.getSqlSession();
		try {
			RoadNetMapper road = session.getMapper(RoadNetMapper.class);
			road.addPoint(point);
			session.commit();
			//System.out.println(point.toString());
		} finally {
			session.close();
		}
	}

}
