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

import com.google.gson.Gson;
import com.sun.org.apache.xpath.internal.functions.FuncStringLength;

import basicVO.Function;

// transfer the basic Json to XML for local storing.
public class RequestXML extends HttpServlet {
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("text/html");
		InputStream inputStream = req.getInputStream();
		byte[] b = new byte[10240];
		// read the basic Json from stream.
		inputStream.read(b);
		String basicJSON = new String(b);
		String XMLString ="";
		try {
			// transfer the basic Json to XML format
			JSONObject object = new JSONObject(basicJSON);
			XMLString = XML.toString(object);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		// send the XML back to client.
		resp.getWriter().write(XMLString);
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		// TODO Auto-generated method stub
		super.doGet(req, resp);
	}

}
