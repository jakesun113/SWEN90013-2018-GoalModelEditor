package JointVO;

import com.google.gson.annotations.SerializedName;


/**
 * This is an attribute of actor. So the image is hard code.
 */
public class Image {
	@SerializedName("xlink:href")
	String svgPath = "Images/Actor.svg";
	int width;
	int height;
		
	public Image(int width, int height) {
		super();
		this.width = width;
		this.height = height;
	}

	public String getSvgPath() {
		return svgPath;
	}

	public void setSvgPath(String svgPath) {
		this.svgPath = svgPath;
	}

	public int getWidth() {
		return width;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

}
