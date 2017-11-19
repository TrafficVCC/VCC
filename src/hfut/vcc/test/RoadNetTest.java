package hfut.vcc.test;

import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import hfut.vcc.util.*;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import java.util.*;

import javax.websocket.Session;

import hfut.vcc.mapping.*;
import org.json.*;

public class RoadNetTest {
	
	//增加后要commit
	public void addPoint(RoadNet point) {
		
		SqlSession session = MyBatisUtil.getSqlSession();
		try {
			RoadNetMapper road = session.getMapper(RoadNetMapper.class);
			road.addPoint(point);
			session.commit();
			System.out.println(point.toString());
		} finally {
			session.close();
		}
	}
	
	//删除后要commit.
	public void deletePoint(int id) {
		SqlSession session = MyBatisUtil.getSqlSession();
		try {
			RoadNetMapper road = session.getMapper(RoadNetMapper.class);
			road.deletePoint(id);
			session.commit();
			System.out.println("success delete");
		} finally {
			session.close();
		}
	}
	
	public static void main(String[] args) throws IOException {
	
		RoadNet point = new RoadNet();
		point.setLng(117.21321);
		point.setLat(28.3243);
		point.setDist(1233);
		point.setWay("黄山路");
		point.setLd(0);
		
		RoadNetTest test = new RoadNetTest();
		test.addPoint(point);	
	}
}
