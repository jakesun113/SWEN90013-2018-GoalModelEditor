package JointVO;

import com.google.gson.annotations.SerializedName;


/**
 * The text attribute of all cells.
 */
public class Text {
	boolean magnet = true;
	Integer testSize = 22;
	String text;
	@SerializedName("ref-y")
	int y;
	@SerializedName("font-size")
	int fontSize = 7;
	@SerializedName("y-alignment")
	String yalign = "middle";
	@SerializedName("x-alignment")
	String xalign = "middle";

	String fill = "black";

	public String getText() {
		return text;
	}

	public void setText(String text) {
		if (text.length()>testSize) {
			text = text.substring(0,testSize);
		}
		
		if (text.length()>testSize/2) {
			String prefix = text.substring(0, testSize/2);
			String suffix = text.substring(testSize/2);
			text = prefix+"\n"+suffix;
			
		}
		this.text = text;
	}

	public int getY() {
		return y;
	}

	public void setY(int y) {
		this.y = y;
	}

	public int getFontSize() {
		return fontSize;
	}

	public void setFontSize(int fontSize) {
		this.fontSize = fontSize;
	}

}
