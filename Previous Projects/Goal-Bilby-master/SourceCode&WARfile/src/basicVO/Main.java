package basicVO;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;

import com.sun.corba.se.spi.orbutil.threadpool.Work;

// This class generate some sample data for testing functionality of 
// the positioning part.
public class Main {
	public static void main(String[] args) {

		new Main().Work();
	}

	int level=3;
	void Work() {
		Function mainFunction = generateFunction();
		mainFunction.setSubFunctions(generateSUBS(mainFunction, 2));

		FileUtils utils = new FileUtils();
		try {
			utils.write(new File("D:\\z_develop\\eclipse-jee-neon-3-win32-x86_64\\eclipse\\data.json"),
			//utils.write(new File("D:\\eclipse J2ee\\eclipse\\data.json"),
					mainFunction.toJson());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	List<Function> generateSUBS(Function from,int depth){
		if (depth==0) return null;
		List<Function> subFunctions = new ArrayList<>();
		for(int i =0;i<level;i++){
			Function function = generateFunction();
			function.setSubFunctions(generateSUBS(function, depth-1));
			subFunctions.add(function);
		}
		return subFunctions;
	}

	Function generateFunction() {
		Function subFunction1 = new Function();
		subFunction1.setFunction("Build Goal model");

		subFunction1.setQualities("consistency, reliable");

		subFunction1.setRoles("actor, student, teacher");

		subFunction1.setHearts("good, easy, consistency");
		
		subFunction1.setSpades("hard, unstable");
		return subFunction1;
	}
}
