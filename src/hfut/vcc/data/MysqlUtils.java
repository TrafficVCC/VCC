package hfut.vcc.data;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import org.json.*;
import java.util.*;

public class MysqlUtils {
	
	//数据库地址
	private static final String url = "jdbc:mysql://localhost:3306/vcc";
	//用户名
	private static final String user = "root";
	//密码
	private static final String password = "athelp";
	//驱动信息
	private static final String driver = "com.mysql.jdbc.Driver";
	
	//类型到其count数量的映射
	private static final Map<String, Integer> typeTonum = new HashMap<String, Integer>();
	static {
		typeTonum.put("year", 1);
		typeTonum.put("month", 12);
		typeTonum.put("quarter", 4);
		typeTonum.put("week", 7);
	}
	
	private Connection conn;
	private ResultSet rs;
	
	/*建立数据库连接*/
	public Connection getConnection() {
		try {
			Class.forName(driver);
			System.out.println("成功加载Mysql驱动！");
			conn = DriverManager.getConnection(url,user,password);
			if(conn!=null) {
				System.out.println("成功连接到数据库！");
				System.out.println(conn);
			}
		}
		catch(ClassNotFoundException e) {
			e.printStackTrace();
		}
		catch(SQLException e) {
			e.printStackTrace();
		}
		catch(Exception e) {
			e.printStackTrace();
		}
		return conn;
	}
	
	/*根据sql字符串执行sql语句,并返回结果集*/
	public ResultSet queryResult(String sql) {
		ResultSet rs = null;
		try {
			Statement stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
		}
		catch(SQLException e) {
			e.printStackTrace();
		}
		return rs;
	}
	 
	
	/*打印ResultSet结果*/
	public void printResult(ResultSet rs) {
		try {
			ResultSetMetaData data=rs.getMetaData(); //获取结果集中的详细信息
			//rs.next移动到下一行,rs初始指向第一行的前一行
			while(rs.next()) {	
				for(int i=1; i<=data.getColumnCount(); i++) {
//					if(data.getColumnType(i)==4) {
//						//该列类型为INTEGER(4)
//						System.out.print(rs.getInt(i) + "\t");
//					}
				
					System.out.print(rs.getString(i) + "\t");
				}
				System.out.println();	//换行
			}
		}
		catch(SQLException e) {
			e.printStackTrace();
		}
	}
	
	
	/*根据前端传递的参数返回最终的JSON数据*/
	public JSONArray getJSONData(String type,String starty,String endy,String set) throws JSONException,SQLException {
		String sql = querySql(type,starty,endy,set);
	    rs = queryResult(sql);
	    JSONArray js = resultToJson(rs);
	    if(!type.equals("lh")) {
	    	js = combineJSON(js,starty,endy,type);
	    }
	    return js;
	}
	
	/*ResultSet结果集写入json格式*/
	public JSONArray resultToJson(ResultSet rs) throws SQLException,JSONException {
		//json数组
		JSONArray array = new JSONArray();
		
		//获取列数
		ResultSetMetaData metaData = rs.getMetaData();
		int columnCount = metaData.getColumnCount();
		
		//遍历ResultSet中每条数据
		while(rs.next()) {
			//构造函数当参数为true时才会按照放置的顺序，否则会对key排序
			JSONObject jsonObj = new JSONObject(true);
			//遍历每一列
			for(int i=1; i<=columnCount; i++) {
				String name = metaData.getColumnLabel(i);
				Object value = rs.getObject(i);
				jsonObj.put(name, value);
			}
			array.put(jsonObj);
		}
		return array;
	}
	
	
	/*合并具有相同key值的(相同年份合并到一个count数组中),无记录补0*/
	private JSONArray combineJSON(JSONArray array,String starty,String endy,String type) 
			throws JSONException,IndexOutOfBoundsException {
		JSONArray result = new JSONArray();
		//注:HashMap内部是无序的,应用LinkedHashMap
		Map<Object, List> map = new LinkedHashMap<>();
		int num = typeTonum.get(type);
		//初始化map,count里根据类型填充0
		for(int i=Integer.parseInt(starty); i<=Integer.parseInt(endy);i++) {
			List li = new ArrayList<>();
			for(int j=0; j<num; j++) {
				li.add(0);
			}
			map.put(i, li);
		}
		
		for(int i=0; i<array.length(); i++) {
			JSONObject js = array.getJSONObject(i);
			Object key = js.get("year");
			Object index = js.get(type);	//在count中的位置,若是按月查询,则对应第几个月
//			if(!map.containsKey(key)) {
//				List newList = new ArrayList<>();
//				newList.add(js.get("count"));
//				map.put(key, newList);
//			}
			if(type.equals("year"))
			{
				map.get(key).set(0,js.get("count"));
			}
			else
			{
				map.get(key).set((int)index-1,js.get("count"));
			}
		}
		
		Iterator<Object> it = map.keySet().iterator();  
        while (it.hasNext()) {
        	Object key = it.next();
        	JSONObject obj = new JSONObject(true);
        	obj.put("year", key);
        	obj.put("count", map.get(key));
        	result.put(obj);
        }
		return result;
	}
	
	
	/*根据前端传来的参数返回相应的sql*/
	public String querySql(String type,String starty,String endy,String set) throws IllegalArgumentException {
		String sql = "";
		if(type.equals("lh")) {
			sql = roadQuery(type,starty,endy,set);
		}
		else if(type.equals("year")) {
			sql = yearQuery(starty,endy,set);
		}
		else if(type.equals("quarter")) {
			sql = quarterQuery(starty,endy,set);
		}
		else if(type.equals("month")) {
			sql = monthQuery(starty,endy,set);
		}
		else if(type.equals("week")) {
			sql = weekQuery(starty,endy,set);
		}
		else {
			throw new IllegalArgumentException ("Invalid type");
		}
		return sql;
	}
	
	
	/*以下是数据库查询操作
	 * 可按空间查询(道路名,路号)
	 * 按时间查询(年,月,日)
	 * 其他因素(道路类型,天气等)
	 */
	
	/*按道路信息查询(lm,lh,dllx等)*/
	private String roadQuery(String type,String starty,String endy,String set) {
		String wherelh = "";
		if(!set.equals("0")) {
			wherelh = " and lh = "+set;
		}
		
		String sql = "select " +type+" , count(*) as count\n" + 
				 	 "from ybsg1\n" + 
				 	 "where " +type+" is not null and "+
				 	 "YEAR(sgfssj) >= " +starty+ " and YEAR(sgfssj) <= " +endy+ wherelh +"\n" +
				 	 "group by " +type+"\n" + 
				 	 "order by " +type ;
		return sql;
	}
	
	
	/*按年份查询(每年发生交通事故数)*/
	//注意having和where的区别,使用left join,空数据补0
	private String yearQuery(String starty,String endy,String set) {
		String wherelh = "";
		if(!set.equals("0")) {
			wherelh = " and ybsg1.lh = "+set;
		}
		
		String sql = "select YEAR(sgfssj) year, count(*) count\n" + 
					 "from ybsg1\n" + 
					 "where sgfssj is not null " + wherelh +"\n" + 
					 "group by YEAR(sgfssj)\n" + 
					 "having year >= " +starty+ " and year <= " +endy+"\n" +
					 "order by year";
		
		
		return sql;
	}
	
	/*按月查询(每年)*/
	//每年的各个月，group by多个字段分组
	private String monthQuery(String starty,String endy,String set) {
		String wherelh = "";
		if(!set.equals("0")) {
			wherelh = " and ybsg1.lh = "+set;
		}
		
		String sql = "select YEAR(sgfssj) as year,MONTH(sgfssj) as month, count(*) as count\n" + 
					 "from ybsg1\n" + 
					 "where sgfssj is not null " + wherelh +"\n" +  
					 "group by YEAR(sgfssj),MONTH(sgfssj)\n" + 
					 "having year >= " +starty+ " and year <= " +endy+"\n" +
					 "order by year";
		return sql;
	}
	
	/*按星期查询(指定开始和结束年份)*/
	private String weekQuery(String starty,String endy,String set) {
		String wherelh = "";
		if(!set.equals("0")) {
			wherelh = " and lh = "+set;
		}
		
		String sql = "select YEAR(sgfssj) as year, xq as week, count(*) as count\n" + 
					 "from ybsg1\n" + 
					 "where sgfssj is not null and xq is not null "+ wherelh +"\n" + 
					 "group by YEAR(sgfssj),xq\n" + 
					 "having year >= " +starty+ " and year <= " +endy+"\n" +
					 "order by year";
		return sql;
	}
	
	/*按季度查询(每年各个季度统计)*/
	private String quarterQuery(String starty, String endy,String set) {
		String wherelh = "";
		if(!set.equals("0")) {
			wherelh = " and lh = "+set;
		}
		
		String sql = "select YEAR(sgfssj) as year, QUARTER(sgfssj) as quarter, count(*) as count\n" + 
				 	 "from ybsg1\n" + 
				 	 "where sgfssj is not null "+ wherelh +"\n" + 
				 	 "group by YEAR(sgfssj),QUARTER(sgfssj)\n" + 
				 	 "having year >= " +starty+ " and year <= " +endy+"\n" +
				 	 "order by year";
		return sql;
	}
	
	
	/*释放连接资源*/
	public void releaseConn() {
		try {
			if(conn!=null) {
				conn.close();
			}
		}
		catch(SQLException e) {
			e.printStackTrace();
		}
	}

}
