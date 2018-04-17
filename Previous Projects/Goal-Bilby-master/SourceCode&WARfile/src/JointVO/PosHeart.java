package JointVO;

/**
 * The like element of graph
 */
public class PosHeart extends Cell{

	public PosHeart(String texts) {
		super();
		attrs = new Attributes();
		attrs.setPath(new Path("M 272.70141,238.71731 C 206.46141,238.71731 152.70146,292.4773 152.70146,358.71731 C 152.70146,493.47282 288.63461,528.80461 381.26391,662.02535 C 468.83815,529.62199 609.82641,489.17075 609.82641,358.71731 C 609.82641,292.47731 556.06651,238.7173 489.82641,238.71731 C 441.77851,238.71731 400.42481,267.08774 381.26391,307.90481 C 362.10311,267.08773 320.74941,238.7173 272.70141,238.71731 z"));
		size = new Size(50,50);
		
		setInfo(texts);
	}

	public void setInfo(String textString){
		Text text = new Text();
		text.setText(textString);
		text.setY(-size.getHeight()*11/8);
		attrs.setText(text);
	}

}
