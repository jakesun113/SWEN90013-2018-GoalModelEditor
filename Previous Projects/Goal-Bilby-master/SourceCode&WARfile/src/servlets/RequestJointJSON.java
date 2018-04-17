package servlets;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

import basicVO.Function;
import services.JsonService;

/**
 * @author zeven
 * receive basic json and send Joint Json back to browser
 */
public class RequestJointJSON extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8881220685680293792L;
	
	
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("text/html");
		InputStream inputStream = req.getInputStream();
		byte[] b = new byte[10240];
		// read the basic json
		inputStream.read(b);
		String basicJSON = new String(b);
		
		// convert the basic json to joint json
		String JointJSON = new JsonService().convertBasicJSON(basicJSON);
		
		// send the Joint Json back to client.
		resp.getWriter().write(JointJSON);
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		// TODO Auto-generated method stub
		super.doGet(req, resp);
	}


}
