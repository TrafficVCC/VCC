package hfut.vcc.data;

import java.io.IOException;
import java.sql.SQLException;
import org.json.JSONException;
import java.sql.ResultSet;
import org.json.*;
import java.io.FileWriter;

public class Main {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		try {
			MysqlUtils mysql = new MysqlUtils();
		    mysql.getConnection();
//		    String sql = mysql.querySql("quarter", "2008", "2014");
//		    ResultSet rs = mysql.queryResult(sql);
//		    JSONArray js=mysql.resultToJson(rs);
		    JSONArray js = mysql.getJSONData("quarter", "2006", "2016", "10206");
		    JSONArray js2 = mysql.getJSONData("lh", "2006", "2016","0");
		    System.out.println(js);
		    System.out.println(js2);
		    
		    //将json字符串写入文件
		    try (FileWriter file = new FileWriter("test.json")) {

	            file.write(js.toString());
	            file.flush();

	        } catch (IOException e) {
	            e.printStackTrace();
	        }
		    
		    //释放资源
		    mysql.releaseConn();
		}
	    catch(SQLException e) {
		    e.printStackTrace();
		}
		catch(JSONException e) {
			e.printStackTrace();
		}
	}
	
}
