package JointVO;


/**
 * The goal element of graph
 */
public class Goal extends Cell {

	public Goal(String texts) {
		super();
		attrs = new Attributes();
		attrs.setPath(new Path("M 30 0 120 0 90 10 0 10 z"));
		size = new Size(70, 40);
		
		setInfo(texts);
	}
	
	public void setInfo(String textString){
		Text text = new Text();
		text.setText(textString);
		text.setY(-size.getHeight()*2/3);
		attrs.setText(text);
	}

}
