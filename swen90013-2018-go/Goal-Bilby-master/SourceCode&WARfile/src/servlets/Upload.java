package servlets;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.*;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

import com.google.gson.Gson;
import com.thoughtworks.xstream.XStream;

import basicVO.Function;

// convert the XML format to Basic Json format
public class Upload extends HttpServlet {

	private static final long serialVersionUID = 102831973239L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		super.doGet(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("text/html");
		InputStream inputStream = req.getInputStream();
		byte[] b = new byte[10240];
		//read XML data from the steam.
		inputStream.read(b);
		String xml = new String(b);

		JSONObject xmlJSONObj =  new JSONObject();
		try {
			// convert the XML file to Basic Json
			xmlJSONObj = XML.toJSONObject(xml);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		// write it back to browser
		resp.getWriter().write(xmlJSONObj.toString());
	}

}
