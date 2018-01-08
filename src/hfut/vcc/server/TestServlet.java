package hfut.vcc.server;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.ibatis.session.SqlSession;
import org.json.JSONException;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import hfut.vcc.util.MyBatisUtil;
import hfut.vcc.mapping.TestMapper;
import org.json.*;

/**
 * Servlet implementation class TestServlet
 */
@WebServlet("/TestServlet")
public class TestServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public TestServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String type = request.getParameter("type");
		String[] year = request.getParameterValues("year[]");
		String set = request.getParameter("set");
		
//		System.out.println(year);
//		
//		 List<String[]> yearArray = new ArrayList<String[]>();	//每个属性对应一个数组,[["1","2"],["2","3"]]
//		    for(int i=0; i<year.length; i++) {
//		    	String[] temp = null;
//		    	if(year[i].length()!=0) {
//		    		temp = year[i].split("/");
//		    	}
//		    	else {
//		    		temp = new String[0];
//		    	}
//		    	yearArray.add(temp);
//		    	System.out.println(temp.length);
//		    }
		
		Map<String,Object> params = new HashMap<String,Object>();
		params.put("yearArray", year);
		params.put("set", set);
		
		String js = new String();
		try {
			if(type.equals("month")) {
				js = getJSON(params);
			}
		}
		catch(Exception e) {
			e.printStackTrace();
		}
		
		System.out.println(js);
		PrintWriter out = response.getWriter();
		out.print(js);
		
		//response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	
	private String getJSON(Map<String,Object> params) throws JSONException, IllegalArgumentException {
		SqlSession session = MyBatisUtil.getSqlSession();
		TestMapper test = session.getMapper(TestMapper.class);
		
		Gson gson = new GsonBuilder()	//使用GsonBuilder结果中会包含null的字段
		        .serializeNulls()
		        .create();	
		
			
		List<Map<String,Object>> li = new ArrayList<Map<String,Object>>();
		li = test.monthQuery(params);
		
		return gson.toJson(li);
	}

}
