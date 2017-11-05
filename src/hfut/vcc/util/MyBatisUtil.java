package hfut.vcc.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

/*MyBatis工具类*/

public class MyBatisUtil {
	
	//获取SqlSessionFactory
	public static SqlSessionFactory getSqlSessionFactory() {
		 String resource = "conf.xml";
		 InputStream is = MyBatisUtil.class.getClassLoader().getResourceAsStream(resource);
		 SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(is);
		 return factory;
	}
	
	//获取SqlSession
	public static SqlSession getSqlSession() {
		return getSqlSessionFactory().openSession();
	}
	
}
