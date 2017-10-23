package hfut.vcc.data;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;

public class SqlData {
	
	/*绝对位置查询和距2006-01-01的天数*/
	public String roadjdwzQuery(String set) {
		String sql = "SELECT lh, jdwz, (TO_DAYS(DATE(sgfssj))-TO_DAYS('2006-01-01')) as time\n" +
					 "FROM ybsg1\n" +
					 "WHERE lh = " +set+ " AND jdwz IS NOT NULL AND sgfssj IS NOT NULL\n" +
					 "ORDER BY jdwz";	
		return sql;
	}
}
