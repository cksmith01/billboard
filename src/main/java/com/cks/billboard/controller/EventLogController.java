package com.cks.billboard.controller;

import com.cks.billboard.dao.EventLogDao;
import com.cks.billboard.model.EventLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("/eventLog")
public class EventLogController {

    @Autowired
    EventLogDao eventLogDao;

    @GetMapping("/")
    public List<EventLog> all() {
        return eventLogDao.getAllEventLogs();
    }

    @GetMapping("/range/{start}/{end}")
    public List<EventLog> range(@PathVariable("start") String start, @PathVariable("end") String end) throws ParseException {
        return eventLogDao.getEventLogByRange(start, end);
    }
}
