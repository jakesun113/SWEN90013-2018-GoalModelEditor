package utils;

import org.apache.commons.id.random.SessionIdGenerator;

// generate id for cell of Joint Graph.
public class IDUtils {
	public static String generateID(){
		return new SessionIdGenerator().nextStringIdentifier();		
	}
}
