package JointVO;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

import com.google.gson.Gson;

/**
 * Provide function of transferring current
 * object to Json string.
 */
public class AbstractVO {
	public String toJson() {
		return new Gson().toJson(this);

	}
	
	public String toXML() {
		String json = toJson();
		try {
			JSONObject object = new JSONObject(json);
			return XML.toString(object);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return "";
		
	}
}
