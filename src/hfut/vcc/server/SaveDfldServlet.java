package hfut.vcc.server;

import java.io.IOException;
import java.util.*;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.ibatis.session.SqlSession;
import org.json.JSONArray;
import org.json.JSONException;
import hfut.vcc.bean.RoadDfld;
import hfut.vcc.mapping.DfldMapper;
import hfut.vcc.mapping.RoadNetMapper;
import hfut.vcc.util.MyBatisUtil;

/**
 * Servlet implementation class SaveDfldServlet
 */
@WebServlet("/SaveDfldServlet")
public class SaveDfldServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SaveDfldServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String lm = request.getParameter("lm");
		String data = request.getParameter("hotdata");
		
		try {
			JSONArray js = new JSONArray(data);
			JSONArray js_dfld = js.getJSONObject(0).getJSONArray("dfld");
			
			List<RoadDfld> dfldList = new ArrayList<RoadDfld>();
			for(int i=0; i<js_dfld.length(); i++) {
				JSONArray dfld = js_dfld.getJSONObject(i).getJSONArray("data");
				int id =  js_dfld.getJSONObject(i).getInt("id");
				
				for(int j=0; j<dfld.length(); j++) {
					RoadDfld rd = new RoadDfld();
					rd.setDegree(1);
					rd.setDist(dfld.getJSONObject(j).getInt("jdwz"));
					rd.setLng(dfld.getJSONObject(j).getDouble("lng_jdwz"));
					rd.setLat(dfld.getJSONObject(j).getDouble("lat_jdwz"));
					rd.setSgld(id);
					rd.setWay(lm);		
					dfldList.add(rd);
				}		
			}
			
			SqlSession session = MyBatisUtil.getSqlSession();
			try {
				DfldMapper road = session.getMapper(DfldMapper.class);
				road.insertDfld(dfldList);
				session.commit();
				//System.out.println(point.toString());
			} finally {
				session.close();
			}
			
			System.out.println("data "+js_dfld.toString());
			
		} catch (JSONException e) {
			// TODO Auto-generated catch block
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

}
