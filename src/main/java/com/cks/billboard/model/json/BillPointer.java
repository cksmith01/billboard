package com.cks.billboard.model.json;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@JsonDeserialize(using = BillPointerDeserializer.class)
public class BillPointer {
    private String number;
    private String trackingID;
    private String updatetime;
    private String LastActionTime;

    public BillPointer() {
    }

    public BillPointer(String number, String trackingID, String updatetime, String lastActionTime) {
        this.number = number;
        this.trackingID = trackingID;
        this.updatetime = updatetime;
        LastActionTime = lastActionTime;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getTrackingID() {
        return trackingID;
    }

    public void setTrackingID(String trackingID) {
        this.trackingID = trackingID;
    }

    public String getUpdatetime() {
        return updatetime;
    }

    public void setUpdatetime(String updatetime) {
        this.updatetime = updatetime;
    }

    public String getLastActionTime() {
        return LastActionTime;
    }

    public void setLastActionTime(String lastActionTime) {
        LastActionTime = lastActionTime;
    }

}
