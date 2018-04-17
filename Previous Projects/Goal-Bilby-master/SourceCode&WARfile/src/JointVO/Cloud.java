package JointVO;


/**
 * cloud element of the graph
 */
public class Cloud extends Cell {

	public Cloud(String texts) {
		super();
		attrs = new Attributes();
		attrs.setPath(new Path("M 406.1 227.63c-8.23-103.65-144.71-137.8-200.49-49.05 -36.18-20.46-82.33 3.61-85.22 45.9C80.73 229.34 50 263.12 50 304.1c0 44.32 35.93 80.25 80.25 80.25h251.51c44.32 0 80.25-35.93 80.25-80.25C462 268.28 438.52 237.94 406.1 227.63 z"));
		size = new Size(50, 50);
		
		setInfo(texts);
	}
	public void setInfo(String textString){
		Text text = new Text();
		text.setText(textString);
		text.setY(-size.getHeight()*7/8);
		attrs.setText(text);
	}

}
