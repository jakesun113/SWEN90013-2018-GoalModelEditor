package JointVO;

import com.google.gson.annotations.SerializedName;

/**
 * the special attributes for link
 */
public class AttributesLink extends Attributes {
	@SerializedName(".marker-source")
	Path path;

	@SerializedName(".marker-arrowheads")
	Fill fill1 = new Fill();

	@SerializedName(".marker-vertices")
	Fill fill2 = new Fill();

	@SerializedName(".connection-wrap")
	Fill fill3 = new Fill();

	@SerializedName(".link-tools")
	Fill fill4 = new Fill();

	public Path getPath() {
		return path;
	}

	public void setPath(Path path) {
		this.path = path;
	}
	
	
}
