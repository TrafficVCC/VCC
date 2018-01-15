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
import org.json.JSONException;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import hfut.vcc.mapping.OtherMapper;
import hfut.vcc.mapping.RoadFittingMapper;
import hfut.vcc.util.MyBatisUtil;

/**
 * Servlet implementation class RoadFittingServlet
 */
@WebServlet("/RoadFittingServlet")
public class RoadFittingServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RoadFittingServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String[] year = request.getParameterValues("year[]");	//一定注意获取前端数组时要在字段后加上[]
		String[] month = request.getParameterValues("month[]");
		String lm = request.getParameter("lm");
		
		Map<String,Object> params = new HashMap<String,Object>();
		params.put("year", (String[])year);
		params.put("month", (String[])month);
		params.put("lm", lm);
		
		System.out.println(year);
		
		String js = new String();
		try {
			js = getJSON(params);
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
	
	private String getJSON(Map<String,Object> params) throws JSONException, IllegalArgumentException {
		SqlSession session = MyBatisUtil.getSqlSession();
		RoadFittingMapper rf = session.getMapper(RoadFittingMapper.class);
		
		//还是用Gson解析方便
		Gson gson = new GsonBuilder()	//使用GsonBuilder结果中会包含null的字段
				   .serializeNulls()
				   .create();	
		
		List<Map<String,Object>> li = new ArrayList<Map<String,Object>>();
		li = rf.roadfittingQuery(params);
		
		long[] fit = getfit2(li);	//道路拟合数据
		
		return gson.toJson(fit);
	}
	
	private long[] getfit2(List<Map<String,Object>> li) {
		int[] add = new int[]{11,10,10,8,5,2,1};
		int max_jdwz = (int) li.get(li.size()-1).get("jdwz");	//最大绝对位置
		int total = max_jdwz / 10 + 1;
		long[] fit = new long[total];
		for(int i=0; i<total; i++) {
			fit[i] = 0;
		}
		
		for(int i=0; i<li.size(); i++) {
			Map<String,Object> map = li.get(i);
			int jdwz = (int)map.get("jdwz");
			//System.out.println(jdwz);
			long count = (Long)map.get("count");
			int index = jdwz / 10;
			
			int index_temp = index;
			int k = 0;
			while(index_temp >= 0 && k < add.length) {
				fit[index_temp] += count * add[k];
				index_temp--;
				k++;
			}
			
			index_temp = index + 1;
			k = 1;
			while(index_temp < total && k < add.length) {
				fit[index_temp] += count * add[k];
				index_temp++;
				k++;
			}
		}
		
		return fit;
	}
	
	private long[] getfit(List<Map<String,Object>> li) {
		//初始参数
		int total = 1000;
		int add = 5;
		int max_jdwz = (int) li.get(li.size()-1).get("jdwz");	//最大绝对位置
		double rate = (double)total / max_jdwz;;	
		System.out.println(rate);
				
		long[] fit = new long[total];
		for(int i=0; i<total; i++) {
			fit[i] = 0;
		}
				
		for(int i=0; i<li.size(); i++) {
			Map<String,Object> map = li.get(i);
			int jdwz = (int)map.get("jdwz");
			//System.out.println(jdwz);
			long count = (Long)map.get("count");	
			//System.out.println(count);
			int index = (int)Math.round(jdwz * rate);	//映射到fit里的索引
			int index2 = (index < total) ? index : total - 1; 
			//System.out.println(index2);
					
			int index_temp = index2;
			int add_temp = add;
			while(index_temp >= 0 && add_temp > 0) {
				fit[index_temp] += count*add_temp;
				//System.out.println(fit[index_temp]);
				index_temp--;
				add_temp--;
			}
					
			add_temp = add-1;
			index_temp = index2 + 1;	//index已经累加过一次了,不需要重复计算
			while(index_temp < total && add_temp > 0) {
				fit[index_temp] += count*add_temp;
				index_temp++;
				add_temp--;
			}
		}
		
		return fit;
	}

}
