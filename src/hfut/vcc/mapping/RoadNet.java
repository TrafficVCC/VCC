package hfut.vcc.mapping;

//道路结构实体类
public class RoadNet {
	
	private int id;
	private double lng;
	private double lat;
	private double distance;
	private String way;
	private int ld;
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public double getLng() {
		return lng;
	}
	
	public void setLng(double lng) {
		this.lng = lng;
	}
	
	public double getLat() {
		return lat;
	}
	
	public void setLat(double lat) {
		this.lat = lat;
	}
	
	public double getDist() {
		return distance;
	}
	
	public void setDist(double distance) {
		this.distance = distance;
	}
	
	public String getWay() {
		return way;
	}
	
	public void setWay(String way) {
		this.way = way;
	}
	
	public int getLd() {
		return ld;
	}
	
	public void setLd(int ld) {
		this.ld = ld;
	}
	
	@Override
	public String toString() {
	    return this.way+" "+this.ld+" "+this.lng+" "+this.lat;
	}
}
