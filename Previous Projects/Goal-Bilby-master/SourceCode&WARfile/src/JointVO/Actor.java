package JointVO;

/**
 * Actor element of the graph, extending from cell
 *
 */
public class Actor extends Cell {
	

	public Actor(String texts) {
		super();
		attrs = new Attributes();
		attrs.setImage(new Image(40,30));
		this.setType("basic.Image");
		size = new Size(60, 45);
		
		setInfo(texts);
	}
	
	@Override
	public void setInfo(String textString) {
		// TODO Auto-generated method stub
		Text text = new Text();
		text.setText(textString);
		text.setY(-size.getHeight()/3);
		attrs.setText(text);
	}

}
