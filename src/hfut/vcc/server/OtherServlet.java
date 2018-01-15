package hfut.vcc.server;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.ibatis.session.SqlSession;
import org.json.*;
import com.google.gson.*;

import hfut.vcc.mapping.OtherMapper;
import hfut.vcc.util.MyBatisUtil;
import hfut.vcc.util.MySqlUtil;

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
		String type = request.getParameter("type");
		String[] year = request.getParameterValues("year[]");
		String[] set = request.getParameterValues("set[]");
		System.out.println("lm "+set);
	    String[] attr = request.getParameterValues("attr[]");
	    String[] content = request.getParameterValues("content[]");
	    
	    List<String[]> contentArray = new ArrayList<String[]>();
	    for(int i=0; i<content.length; i++) {
	    	String[] temp = null;
	    	if(content[i].length()!=0) {
	    		temp = content[i].split("/");
	    	}
	    	else {
	    		temp = new String[0];
	    	}
	    	contentArray.add(temp);
	    }
	    
		Map<String,Object> params = new HashMap<String,Object>();
		params.put("year", year);
		params.put("set", set);
		params.put("attr", attr);
		params.put("contentArray", contentArray);
		
		String js = new String();
		try {
			if(type.equals("factor")) {
				js = getFactor(params);
			}
			else if(type.equals("factorCount")) {
				js = getFactorCount(params);
			}
		}
		catch(JSONException e) {
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
	
	private String getFactor(Map<String,Object> params) throws JSONException, IllegalArgumentException {
		SqlSession session = MyBatisUtil.getSqlSession();
		OtherMapper other = session.getMapper(OtherMapper.class);
		
		List<Object> json = new ArrayList<Object>();
		String[] attr = (String[])params.get("attr");
		List<String[]> contentArray = (List<String[]>)params.get("contentArray");
		
		//还是用Gson解析方便
		Gson gson = new GsonBuilder()	//使用GsonBuilder结果中会包含null的字段
		        .serializeNulls()
		        .create();	
		
		Map<String,Object> pa = new LinkedHashMap<String,Object>();
		List<Map<String,Object>> list = new ArrayList<>();		
		pa.put("year", (String[])params.get("year"));
		pa.put("set", (String[])params.get("set"));
		for(int i=0; i<attr.length; i++) {
			Map<String,Object> temp = new LinkedHashMap<String,Object>();
			temp.put("attr", attr[i]);
			temp.put("content", (String[])contentArray.get(i));
			list.add(temp);
		}
		pa.put("allAttr",list);		//将所有的需要进行条件判断的属性存在List里
		
		//每相邻两个属性之间进行查询
		for(int i=0; i<attr.length-1; i++) {
			pa.put("attr1", attr[i]);
			pa.put("attr2", attr[i+1]);
			pa.put("content1Array", (String[])contentArray.get(i));
			pa.put("content2Array", (String[])contentArray.get(i+1));
			
			List<Map<String,Object>> li = new ArrayList<Map<String,Object>>();
			li = other.factorQuery2(pa);
			
			//System.out.println(gson.toJson(li));
			json.add(li);
		}
		//System.out.println(gson.toJson(json));
		return gson.toJson(json);
	}
	
	private String getFactorCount(Map<String,Object> params) throws JSONException, IllegalArgumentException {
		SqlSession session = MyBatisUtil.getSqlSession();
		OtherMapper other = session.getMapper(OtherMapper.class);
		
		List<Object> json = new ArrayList<Object>();
		String[] attr = (String[])params.get("attr");
		
		//还是用Gson解析方便
				Gson gson = new GsonBuilder()	//使用GsonBuilder结果中会包含null的字段
				        .serializeNulls()
				        .create();	
				
		for(int i=0; i<attr.length; i++) {
			Map<String,Object> pa = new LinkedHashMap<String,Object>();
			pa.put("year", (String[])params.get("year"));
			pa.put("set", (String)params.get("set"));
			pa.put("attr", attr[i]);
			
			List<Map<String,Object>> li = new ArrayList<Map<String,Object>>();
			li = other.factorCountQuery(pa);
			json.add(li);
		}	
		return gson.toJson(json);
	}

}
