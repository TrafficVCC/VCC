package hfut.vcc.server;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import hfut.vcc.data.MysqlUtils;
import hfut.vcc.data.SqlData;
import org.json.*;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Servlet implementation class DataServlet
 */
@WebServlet("/DataServlet")
public class DataServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DataServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String lh = request.getParameter("lh");
		MysqlUtils mysql = new MysqlUtils();
		SqlData sd = new SqlData();
		JSONArray js = new JSONArray();
		
		try {
			mysql.getConnection();
			String sql = sd.roadjdwzQuery(lh);
		    ResultSet rs = mysql.queryResult(sql);
		    js=mysql.resultToJson(rs);
			mysql.releaseConn();
		}
		catch(SQLException e) {
			e.printStackTrace();
		}
		catch(JSONException e) {
			e.printStackTrace();
		}
		
		System.out.println(js);
		PrintWriter out = response.getWriter();
		out.print(js.toString());
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
