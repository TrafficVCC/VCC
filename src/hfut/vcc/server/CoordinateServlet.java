package hfut.vcc.server;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.ibatis.session.SqlSession;
import org.json.*;
import org.json.JSONException;
import hfut.vcc.mapping.CoordinateMapper;
import hfut.vcc.mapping.RoadNet;
import hfut.vcc.mapping.RoadNetMapper;
import hfut.vcc.util.MyBatisUtil;

import hfut.vcc.bean.*;
import com.google.gson.*;
import com.sun.glass.ui.CommonDialogs.Type;

import java.util.*;

/**
 * Servlet implementation class CoordinateServlet
 */
@WebServlet("/CoordinateServlet")
public class CoordinateServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CoordinateServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String data = request.getParameter("data");
		System.out.println(data);
		
		try {
			RoadCoor[] array = new Gson().fromJson(data,RoadCoor[].class);
			List<RoadCoor> list = Arrays.asList(array);
			SqlSession session = MyBatisUtil.getSqlSession();
			CoordinateMapper coor = session.getMapper(CoordinateMapper.class);
			coor.updateCoorBatch(list);	//批量更新
			session.commit();
			session.close();
			
			System.out.println(list);
//			for(int i=0; i<js.length(); i++) {
//				params.put("sgdd", js.getJSONObject(i).getString("sgdd"));
//				params.put("jdwz", js.getJSONObject(i).getInt("jdwz"));
//				params.put("lng", js.getJSONObject(i).getDouble("lng_jdwz"));
//		        params.put("lat", js.getJSONObject(i).getDouble("lat_jdwz"));
//				params.put("lng_jdwz", js.getJSONObject(i).getDouble("lng_jdwz"));
//				params.put("lat_jdwz", js.getJSONObject(i).getDouble("lat_jdwz"));
//				params.put("lng_sgdd", js.getJSONObject(i).getDouble("lng_sgdd"));
//				params.put("lat_sgdd", js.getJSONObject(i).getDouble("lat_sgdd"));		
//			}
			
		} catch (Exception e) {
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
