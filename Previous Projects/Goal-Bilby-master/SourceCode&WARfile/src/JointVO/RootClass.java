package JointVO;

import java.util.ArrayList;
import java.util.List;


/**
 * The root class is a container for all
 * cells. And it extends from AbstractVO,
 * which can transfer itself to JSON
 */
public class RootClass extends AbstractVO {
	List<Cell> cells;

	public List<Cell> getCells() {
		return cells;
	}

	public void setCells(List<Cell> cells) {
		this.cells = cells;
	}
	
	public void addCell(Cell t) {
		if(cells == null){
			cells = new ArrayList<>();
		}
		cells.add( t);
	}
	
	public void addAllCells(List<Cell> cells) {
		if(this.cells == null){
			this.cells = new ArrayList<>();
		}
		this.cells.addAll(cells);
	}
	
}
