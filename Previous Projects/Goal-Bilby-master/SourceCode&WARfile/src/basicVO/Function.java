package basicVO;

import java.util.List;

import com.google.gson.annotations.SerializedName;
// Basic json object for function(goal). It is a recursive structure
// which has included all elements of a goal model.
public class Function extends AbstactObject{
	
	/**
	 * Role element of goal model
	 */
	String roles ;
	
	/**
	 * Quality element of goal model
	 */
	String qualities;
	
	/**
	 * Like element of goal model
	 */
	String hearts;
	
	
	/**
	 * Dislike element of goal model
	 */
	String spades;
	
	
	/**
	 * Subgoal element of goal model
	 */
	@SerializedName("children")
	List<Function> subFunctions;
	
	
	/**
	 * Goal name
	 */
	@SerializedName("name")
	String function;
	
	public String getFunction() {
		return function;
	}
	public void setFunction(String function) {
		this.function = function;
	}
	public List<Function> getSubFunctions() {
		return subFunctions;
	}
	public void setSubFunctions(List<Function> subFunctions) {
		this.subFunctions = subFunctions;
	}
	
	public String getRoles() {
		return roles;
	}
	public void setRoles(String roles) {
		this.roles = roles;
	}
	public String getQualities() {
		return qualities;
	}
	public void setQualities(String qualities) {
		this.qualities = qualities;
	}
	public String getHearts() {
		return hearts;
	}
	public void setHearts(String hearts) {
		this.hearts = hearts;
	}
	public String getSpades() {
		return spades;
	}
	public void setSpades(String spades) {
		this.spades = spades;
	}
	
}
