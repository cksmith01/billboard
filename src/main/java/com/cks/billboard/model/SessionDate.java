package com.cks.billboard.model;

public class SessionDate {

	private String sessionDay;
	private String itemDate;

	public SessionDate(String sessionDay, String itemDate) {
		this.sessionDay = sessionDay;
		this.itemDate = itemDate;
	}

	public String getSessionDay() {
		return sessionDay;
	}

	public void setSessionDay(String sessionDay) {
		this.sessionDay = sessionDay;
	}

	public String getItemDate() {
		return itemDate;
	}

	public void setItemDate(String itemDate) {
		this.itemDate = itemDate;
	}

}
