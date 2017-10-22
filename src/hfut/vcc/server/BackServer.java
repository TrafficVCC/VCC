package hfut.vcc.server;

import java.io.PrintWriter;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import hfut.vcc.data.MysqlUtils;
import org.json.*;
import java.sql.SQLException;

/**
 * Servlet implementation class BackServer
 */
@WebServlet("/BackServer")
public class BackServer extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public BackServer() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String type = request.getParameter("type");
		String starty = request.getParameter("starty");
		String endy = request.getParameter("endy");
		String set = request.getParameter("set");
		
		MysqlUtils mysql = new MysqlUtils();
		JSONArray js = new JSONArray();
		try {
			mysql.getConnection();
			js = mysql.getJSONData(type, starty, endy, set);
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
