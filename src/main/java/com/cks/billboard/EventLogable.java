package com.cks.billboard;

import com.cks.billboard.dao.EventLogDao;
import com.cks.billboard.model.EventLog;
import com.cks.billboard.util.Dates;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.DecimalFormat;

@Component
public class EventLogable {

    private double startTime;
    DecimalFormat df = new DecimalFormat("#.#");

    @Autowired
    EventLogDao eventLogDao;

    protected String getDurationValue() {
        if (startTime == 0) return "0.0";
        return df.format((System.currentTimeMillis() - startTime) / 1000);
    }

    protected void start() {
        startTime = System.currentTimeMillis();
    }

    protected void eventLog(EventLog event) {
        eventLogDao.insertEventLog(event);
    }

    protected void eventLog(String eventType, String eventDesc) {
        EventLog event = new EventLog();
        event.setEventDate(Dates.formatDB(null));
        event.setEventType(eventType);
        event.setEventDesc(eventDesc);
        event.setDurationSeconds(getDurationValue());
        eventLogDao.insertEventLog(event);
    }
}
