package JointVO;

public class Size extends AbstractVO{
	int width;
	int height;
	
	
	public Size(int width, int height) {
		this.width = width;
		this.height = height;
	}
	
	public Size(Size size) {
		this.width = size.getWidth();
		this.height = size.getHeight();
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
	public Size plus(Size size){
		this.width += size.getWidth();
		this.height += size.getHeight();
		return new Size(this);
	}
	
}
