package hfut.vcc.mapping;

import java.util.List;

public interface RoadNetMapper {
	
	public void addPoint(RoadNet point);
	
	public void deletePoint(int id);
	
	public List selectRoad(String way);
}
