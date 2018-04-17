package JointVO;

public class Position extends AbstractVO{
	int x;
	int y;
	
	
	public Position(int x, int y) {
		this.x = x;
		this.y = y;
	}
	
	public Position(Position from) {
		this.x = from.getX();
		this.y = from.getY();
	}
	
	public int getX() {
		return x;
	}
	public void setX(int x) {
		this.x = x;
	}
	public int getY() {
		return y;
	}
	public void setY(int y) {
		this.y = y;
	}
	
	public Position plus(Size size){
		return new Position(x+size.getWidth(),y+size.getHeight());
	}
	public Position minus(Size size){
		return new Position(x-size.getWidth(),y-size.getHeight());
	}
	
	public void pluss(Size size){
		this.x += size.getWidth();
		this.y += size.getHeight();
	}
	public void minuss(Size size){
		this.x -= size.getWidth();
		this.y -= size.getHeight();
	}
	
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return x+" "+y;
	}
}
