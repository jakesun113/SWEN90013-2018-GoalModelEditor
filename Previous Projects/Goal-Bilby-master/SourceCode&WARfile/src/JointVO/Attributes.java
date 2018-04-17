package JointVO;

/**
 * This element is for cell. Some cell has attributes.
 *
 */
public class Attributes extends AbstractVO{
	
	private Path path;
	private Text text;
	private Image image;
	
	
	public Image getImage() {
		return image;
	}
	public void setImage(Image image) {
		this.image = image;
	}
	public Path getPath() {
		return path;
	}
	public void setPath(Path path) {
		this.path = path;
	}
	public Text getText() {
		return text;
	}
	public void setText(Text text) {
		this.text = text;
	}
	
}
