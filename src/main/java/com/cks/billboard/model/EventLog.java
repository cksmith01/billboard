package com.cks.billboard.model;

public class EventLog {
    private Integer eventId;
    private String eventDate;
    private String eventType;
    private String eventDesc;
    // this is a float in the DB but it's a string here so I can control the float format (1 decimal point)
    private String durationSeconds;

    public EventLog() {
    }

    public EventLog(Integer eventId, String eventDate, String eventType, String eventDesc, String durationSeconds) {
        this.eventId = eventId;
        this.eventDate = eventDate;
        this.eventType = eventType;
        this.eventDesc = eventDesc;
        this.durationSeconds = durationSeconds;
    }

    public Integer getEventId() {
        return eventId;
    }

    public void setEventId(Integer eventId) {
        this.eventId = eventId;
    }

    public String getEventDate() {
        return eventDate;
    }

    public void setEventDate(String eventDate) {
        this.eventDate = eventDate;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getEventDesc() {
        return eventDesc;
    }

    public void setEventDesc(String eventDesc) {
        this.eventDesc = eventDesc;
    }

    public String getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(String durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    @Override
    public String toString() {
        return "EventLog{" +
                "eventId=" + eventId +
                ", eventDate='" + eventDate + '\'' +
                ", eventType='" + eventType + '\'' +
                ", eventDesc='" + eventDesc + '\'' +
                ", durationSeconds=" + durationSeconds +
                '}';
    }
}