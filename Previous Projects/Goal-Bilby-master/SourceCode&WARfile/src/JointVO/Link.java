package JointVO;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.annotations.SerializedName;


/**
 * The link element of the graph.
 */
public class Link extends Cell{
	Element source;
	Element target;
	
	List<Position> vertices;

	public Link() {
		super();
		this.setType("link");
		setAttrs(new AttributesLink());
		this.size = null;
	}

	public void addBreak(Position t) {
		if(vertices == null){
			vertices = new ArrayList<>();
		}
		vertices.add( t);
	}

	public Element getSource() {
		return source;
	}

	public void setSource(Element source) {
		this.source = source;
	}

	public Element getTarget() {
		return target;
	}

	public void setTarget(Element target) {
		this.target = target;
	}
	
	
}
