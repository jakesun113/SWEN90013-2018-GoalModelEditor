package basicVO;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

import com.google.gson.Gson;
import com.thoughtworks.xstream.XStream;

// this object is abstract object for all basic json object,
// which provide common method for transfer current object to
// Json string.
public class AbstactObject {

	// transfer current object to Json string.
	public String toJson() {
		return new Gson().toJson(this);
	}
	
}
