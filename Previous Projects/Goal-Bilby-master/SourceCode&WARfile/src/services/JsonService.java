package services;

import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.omg.CORBA.Current;

import com.google.gson.Gson;
import com.google.gson.stream.JsonReader;
import com.sun.swing.internal.plaf.basic.resources.basic;

import JointVO.Actor;
import JointVO.AttributesLink;
import JointVO.Cell;
import JointVO.Cloud;
import JointVO.Element;
import JointVO.Goal;
import JointVO.Link;
import JointVO.NegHeart;
import JointVO.PosHeart;
import JointVO.Position;
import JointVO.RootClass;
import JointVO.Size;
import basicVO.Emotion;
import basicVO.Function;
import basicVO.Quality;
import basicVO.Role;
import javafx.scene.chart.PieChart.Data;
import utils.IDUtils;

public class JsonService {
	
	/**
	 * the sequence of the cell
	 */
	int z = 0;
	
	/**
	 * the position shift for sub-goal
	 */
	Size subMove = new Size(50, 0);
	
	
	/**
	 * the position shift for goal in the same level.
	 */
	Size sibMove = new Size(0, 70);
	
	
	/**
	 * the position shift of elements of in a goal.
	 */
	Size inGoalMove = new Size(40, 0);
	
	/**
	 * the initial position for the first element in the graph
	 */
	Position initPostion = new Position(80, 100);
	
	/**
	 * this function generate the Joint Json accoring to the 
	 * structure and imformation of basic Json
	 * 
	 * @param basicJSON
	 * @return Joint Json
	 */
	public String convertBasicJSON(String basicJSON) {

		Gson gson = new Gson();
		JsonReader reader = new JsonReader(new StringReader(basicJSON));
		reader.setLenient(true);
		// transfer basic Json to object
		Function rootFunction = gson.fromJson(reader, Function.class);
		
		// this root class is for the root of graph
		RootClass rootClass = new RootClass();
		
		// one element of the graph is a cell, and all cells in the root class
		rootClass.addAllCells(rootFunction(rootFunction));
		
		// transfer the root object to Joint Json.
		return rootClass.toJson();
	}

	
	/**
	 * this method will generate all the cells from the function object.
	 * 
	 * @param function
	 * @return all the cells of the goal containing.
	 */
	public List<Cell> rootFunction(Function function) {
		//get all sub goals of the root goal
		List<Function> functions = function.getSubFunctions();
		List<Cell> cells = new ArrayList<Cell>();

		HashMap<String, Position> positionMap = new HashMap<String, Position>();

		Position basicPosition = initPostion.plus(sibMove).plus(sibMove);
		
		// this box is for cells form different branches not overlapping
		Position box = new Position(basicPosition.getX(), basicPosition.getX());
		
		// the position of root goal
		Position forRoot = new Position(0, 0);
		
		// if there is sub goals for the root goal
		if (functions != null && functions.size() > 0) {
			// each sub goal is a branch.
			for (Function sub : functions) {
				forRoot.setX(basicPosition.getX());
				forRoot.setY(basicPosition.getY());
				box = new Position(basicPosition.getX(), basicPosition.getX());
				
				//generate all cells for one branch of root goal
				String sub_id = oneFunctionCalculate(sub, cells, basicPosition, box);
				
				//generate all cells of a branch and put them in a list
				iterateFunction(sub_id, sub, cells, new Position(basicPosition), box);
				positionMap.put(sub_id, basicPosition);
				// change the position of next branch
				basicPosition = new Position(
						basicPosition.getX() + box.getY() - box.getX() + new Goal("").getSize().getWidth(),
						basicPosition.getY());
			}

			// get the position of the root goal.
			Position rootPostion = new Position((forRoot.getX() - initPostion.getX()) / 2 + initPostion.getX(),
					initPostion.getY());
			
			//generate all cells for the root goal of the whole graph
			String main_id = oneFunctionCalculate(function, cells, new Position(rootPostion), box);
			
			//draw links between root goal and the root of branches
			for (String key : positionMap.keySet()) {
				Position current = positionMap.get(key);
				Link link = new Link();
				link.setZ(z++);
				
				// each link has a source and a target
				link.setSource(new Element(main_id));
				link.setTarget(new Element(key));
				
				// each link has two breakpoints
				link.addBreak(new Position(rootPostion.getX() + new Goal("").getSize().getWidth() / 2,
						rootPostion.getY() + sibMove.getHeight() + new Goal("").getSize().getHeight() / 2));
				link.addBreak(new Position(current.getX() + new Goal("").getSize().getWidth() / 2,
						current.getY() - sibMove.getHeight() + new Goal("").getSize().getHeight() / 2));
				cells.add(link);

			}
		}else{
			// if the root doesn't have any sub goals
			forRoot.setX(basicPosition.getX());
			forRoot.setY(basicPosition.getY());
			Position rootPostion = new Position((forRoot.getX() - initPostion.getX()) / 2 + initPostion.getX(),
					initPostion.getY());
			String main_id = oneFunctionCalculate(function, cells, new Position(rootPostion), box);
		}

		return cells;
	}

	
	/**
	 * This method will calculate all the positions and links in one branch.
	 * 
	 * @param parentID
	 * @param sub
	 * @param cells
	 * @param basicPosition
	 * @param box
	 */
	public void iterateFunction(String parentID, Function sub, List<Cell> cells, Position basicPosition, Position box) {
		List<Function> functions = sub.getSubFunctions();
		String sub_id = "";
		basicPosition.pluss(subMove);
		if (functions != null && functions.size() > 0) {
			// generate all cells for the sibling goals
			for (Function function : functions) {
				basicPosition.pluss(sibMove);
				
				// generate all cells for one goal
				sub_id = oneFunctionCalculate(function, cells, basicPosition, box);
				// generate link between this goal and its parent goal
				Link link = new Link();
				link.setZ(z++);
				link.setSource(new Element(parentID));
				link.setTarget(new Element(sub_id));
				// add breakpoints on the link
				link.addBreak(
						new Position(basicPosition.getX() - subMove.getWidth() + new Goal("").getSize().getWidth() / 2,
								basicPosition.getY() + new Goal("").getSize().getHeight() / 2));
				cells.add(link);
				// do the same thing on it sub goals
				iterateFunction(sub_id, function, cells, basicPosition, box);
			}
		}
		basicPosition.minuss(subMove);
	}

	/**
	 * calculate the position of all elements in one goal and 
	 * return the id of this goal
	 * 
	 * @param sub
	 * @param cells
	 * @param basicPosition
	 * @param box
	 * @return id of the goal
	 */
	String oneFunctionCalculate(Function sub, List<Cell> cells, Position basicPosition, Position box) {
		// heart (like)
		String hearts = sub.getHearts();
		
		// spade (dislike)
		String spades = sub.getSpades();
		
		// quality (cloud cell in the graph)
		String qualities = sub.getQualities();
		
		// role (actor cell in the graph)
		String roles = sub.getRoles();

		// the goal 
		Goal goal = new Goal(sub.getFunction());
		Position newPosition = goal.setPosition(basicPosition);
		goal.setZ(z++);
		goal.setId(IDUtils.generateID());
		cells.add(goal);
		if (newPosition.getX() > box.getY()) {
			box.setY(newPosition.getX());
		}
		
		// if there is any qualities of this goal, put that on the left side of the goal.
		if (qualities != null && qualities.length()>0) {
			Cloud cloud = new Cloud(qualities);
			newPosition = cloud.setPosition(newPosition.minus(new Size(cloud.getSize().getWidth()*5/6,0)));
			cloud.setZ(z++);
			cells.add(cloud);
			if (newPosition.getX() > box.getY()) {
				box.setY(newPosition.getX());
			}
		}
		
		// calculate the new position of other elments of the goal, which is on the right side of the goal
		newPosition = new Position(goal.getPosition());
		newPosition.setX(newPosition.getX()+inGoalMove.getWidth());
		
		// if there is any heart element , then add them to the graph
		if (hearts != null && hearts.length()>0) {
			PosHeart heart = new PosHeart(hearts);
			heart.setPosition(new Position(newPosition.getX(),newPosition.getY()-heart.getSize().getHeight()/2));
			heart.setZ(z++);
			cells.add(heart);
			newPosition=newPosition.plus(inGoalMove);		
			if (newPosition.getX() > box.getY()) {
				box.setY(newPosition.getX());
			}
		}
		
		// if there is any spade element, then add them to the graph
		if (spades != null && spades.length()>0) {
			NegHeart heart = new NegHeart(spades);
			heart.setPosition(new Position(newPosition.getX()+inGoalMove.getWidth()/2,newPosition.getY()));
			heart.setZ(z++);
			cells.add(heart);
			newPosition=newPosition.plus(inGoalMove);
			if (newPosition.getX() > box.getY()) {
				box.setY(newPosition.getX());
			}
		}
		
		// if there is any role element, then add them to the graph
		if (roles != null && roles.length()>0) {
			Actor actor = new Actor(roles);
			actor.setPosition(new Position(newPosition.getX()+inGoalMove.getWidth()/2,newPosition.getY()));
			actor.setZ(z++);
			cells.add(actor);
			newPosition=newPosition.plus(inGoalMove);
			if (newPosition.getX() > box.getY()) {
				box.setY(newPosition.getX());
			}
		}

		return goal.getId();
	}
}
