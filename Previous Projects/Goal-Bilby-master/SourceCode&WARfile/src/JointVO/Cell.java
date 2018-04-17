package JointVO;


/**
 * This is the cell element, which contains the basic attributes 
 * of cell.
 */
/**
 * @author zeven
 *
 */
public class Cell {
	
	/**
	 * Type of cell. All elements in the graph are the some except for link.
	 */
	String type = "basic.Path";
	
	
	/**
	 * Size of the cell.
	 */
	Size size;
	
	
	/**
	 * position of the cell
	 */
	Position position;
	
	
	/**
	 * default rotate angle should be 0.
	 */
	int angle =0;
	
	
	/**
	 * id of the cell, link will use this attribute to draw link.
	 */
	String id;
	
	
	/**
	 * the sequence of the cell
	 */
	int z ;
	
	
	/**
	 * some other attributes
	 */
	Attributes attrs;
	
	
	public Cell() {
		size = new Size(50, 40);
	}
	
	public void setInfo(String textString){
		Text text = new Text();
		text.setText(textString);
		text.setY(-size.getHeight());
		attrs.setText(text);
	}
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Size getSize() {
		return size;
	}
	public void setSize(Size size) {
		this.size = size;
	}
	public Position getPosition() {
		return position;
	}
	public Position setPosition(Position position) {
		this.position = new Position(position);
		return new Position(position);
	}
	public int getAngle() {
		return angle;
	}
	public void setAngle(int angle) {
		this.angle = angle;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public int getZ() {
		return z;
	}
	public void setZ(int z) {
		this.z = z;
	}
	public Attributes getAttrs() {
		return attrs;
	}
	public void setAttrs(Attributes attrs) {
		this.attrs = attrs;
	}
	
	
}
