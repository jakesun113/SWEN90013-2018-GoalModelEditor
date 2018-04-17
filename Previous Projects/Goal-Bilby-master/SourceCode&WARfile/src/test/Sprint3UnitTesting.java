package test;
import static org.junit.Assert.*;

import org.apache.commons.id.random.SessionIdGenerator;
import org.junit.Test;

import JointVO.AbstractVO;
import JointVO.Actor;
import JointVO.Element;
import JointVO.Goal;
import JointVO.Image;
import JointVO.Path;
import JointVO.Size;
import JointVO.Text;
/**
 * Provide sprint 3 unit testing 
 */
public class Sprint3UnitTesting {
	
	@Test
	public void test1() {
			SessionIdGenerator generator = new SessionIdGenerator();
			System.out.println(generator.nextIdentifier());
	}
	
	@Test
	public void test2(){
		AbstractVO abstructVO = new AbstractVO();
		abstructVO.toJson();
	}
	@Test
	public void test3(){
		AbstractVO abstructVO = new AbstractVO();
		abstructVO.toXML();
		assertEquals("",abstructVO.toXML());
	}
	@Test
	public void test4(){
		Actor actor = new Actor("text");
		actor.setInfo("textstring");
	}
	@Test
	public void test5(){
		Image image = new Image(1,2);
		image.getWidth();

	}
	@Test
	public void test6(){
		Image image = new Image(1,2);
		image.setSvgPath("Images/Actor.svg");
		image.getSvgPath();
	}
	@Test
	public void test7(){
		Element element = new Element("id");
		element.getId();
	}
	@Test
	public void test8(){
		Goal goal = new Goal("text");
		goal.setInfo("textsring");
		}
	@Test
	public void test9(){
		Path path = new Path("d");
		path.getD();
		}
	@Test
	public void test10(){
		Size size = new Size(1, 2);
		size.plus(size);
		}
	@Test
	public void test11(){
		Text text = new Text();
		text.setText("text");
		
	}
	
	

}
