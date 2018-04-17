package test;

import static org.junit.Assert.*;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

import org.apache.catalina.tribes.util.UUIDGenerator;
import org.apache.commons.id.IdentifierGenerator;
import org.apache.commons.id.random.SessionIdGenerator;
import org.apache.commons.io.FileUtils;
import org.junit.Test;

import JointVO.Actor;
import JointVO.Position;
import JointVO.RootClass;
import services.JsonService;

public class CellTest {

	// Test the id generator. 
	@Test
	public void test() {
		SessionIdGenerator generator = new SessionIdGenerator();
		System.out.println(generator.nextIdentifier());
	}

}
