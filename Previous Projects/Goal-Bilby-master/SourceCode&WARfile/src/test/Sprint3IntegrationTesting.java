package test;
import static org.junit.Assert.*;

import org.junit.Test;

import JointVO.Attributes;
import JointVO.Cell;
import JointVO.Element;
import JointVO.Image;
import JointVO.Link;
import JointVO.Path;
import JointVO.Position;
import JointVO.Size;
import JointVO.Text;
/**
 * Provide sprint 3 integration testing 
 */
public class Sprint3IntegrationTesting {
	
	
		@Test
		public void test1() {
			
			Attributes attributes = new Attributes();
			Text text = new Text();
			 attributes.setText(text);
			text.setFontSize(text.getFontSize());
			final int m = 7;
			assertEquals(m,text.getFontSize());
		}
		@Test
		public void test2() {
			
			Attributes attributes = new Attributes();
			Image image = new Image(1, 2);
			attributes.setImage(image);
			final int m = 1;
			assertEquals(m,attributes.getImage().getWidth());
		}
		
		@Test
		public void test3() {
			
			Attributes attributes = new Attributes();
			Path path = new Path("d");
			attributes.setPath(path);
			final String string = "d";
			assertEquals(string,attributes.getPath().getD());
		}
		
		@Test 
		public void test4() {
			Cell cell = new Cell();
			Position position = new Position(1,2);
			cell.setPosition(position);
			final int m = 1;
			assertEquals(m, cell.getPosition().getX());
			
		}
		
		@Test
		public void test5(){
			Link link = new Link();
			Element element = new Element("heart");
			link.setTarget(element);
			String string = "heart";
			assertEquals(string,link.getTarget().getId());
		}
	


}
