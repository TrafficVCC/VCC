package hfut.vcc.data;


import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;


public class SqlData {
	
	private String sql;
	
	private String x;
	private String y;
	//Demo
	//where a=b;
	private String a;
	private String b;
	
	private String year = "YEAR(sgfssj)";
	private String month = "MONTH(sgfssj)";
	private String day = "DAY(sgfssj)";
	
	
	public String groupSql(String x, String y){
		
		String str = "";
		str = "select " + x + ", " + y + " from ybsg1 group by " + x;
		
		return str;
		
	};
	
//	private String groupSqlF(String x, String y, String table){
//		
//		String sql = "";
//		sql = "select " + x + ", " + y + " from "+ table +" group by " + x;
//		
//		return sql;
//		
//	};
	
	public String whereSql(String x, String y,String a, String b) {

		String str = "";
		str = "select " + x + ", " + y + " from ybsg1 which " + a + "=" + b + " group by " + x;
		
		return str;
	}
	
	
	public static void  printTitle(String x, String y) {
		System.out.println("------------------");
		System.out.println(x + "\t" + y);
		System.out.println("------------------"); 
	}
	
	public static void printXY(ResultSet rs, String x, String y){
		
		String xc;
		String yc;

		try {
				while(rs.next()){
				xc = rs.getString(x);
				yc = rs.getString(y);
				System.out.println(xc + "\t" + yc );
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
			
	};

	
	public String testLink(){
		Connection conn = null;
		Statement stmt = null; 
		try {
			//加载驱动类
			Class.forName("com.mysql.jdbc.Driver");
			conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/vcc","root","athelp");
			
			if(!conn.isClosed()){
                System.out.println("Succeeded connecting to the Database!");
			}
			stmt = conn.createStatement();
			
			
			x = year;
			y = "count(sgbh)";
			
			sql = groupSql( x, y);
			ResultSet rs = stmt.executeQuery(sql);
			
			printTitle(x, "事故数量");
			printXY(rs, x, y);
			
			rs.close();
			conn.close();
			
		

			
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			try {
				if(stmt!=null){
					stmt.close();
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
			try {
				if(conn!=null){
					conn.close();
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return "123";
		
	}

	
	
	
}
