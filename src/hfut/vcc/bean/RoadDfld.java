package hfut.vcc.bean;

public class RoadDfld {
	private int id;
	private double lng;
	private double lat;
	private int distance;
	private String way;
	private int sgld;
	private int degree;
	
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
	
	public int getDist() {
		return distance;
	}
	
	public void setDist(int distance) {
		this.distance = distance;
	}
	
	public String getWay() {
		return way;
	}
	
	public void setWay(String way) {
		this.way = way;
	}
	
	public int getSgld() {
		return sgld;
	}
	
	public void setSgld(int sgld) {
		this.sgld = sgld;
	}
	
	public int getDegree() {
		return degree;
	}
	
	public void setDegree(int degree) {
		this.degree = degree;
	}
	
	@Override
	public String toString() {
	    return this.way+" "+this.sgld+" "+this.lng+" "+this.lat;
	}
}
