package com.cks.billboard.job;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * This job calls the API for committee meeting information, stores it on the server
 * so that it can be easily reloaded and then updates the cache (see DataCache)
 *
 * @author CKSmith
 */

@Component
public class MeetingCalendarJob extends BaseLoader {

//    @Scheduled(cron = "0 0 6,18 * * *") // <-- every day at 6am and 6pm
    public void run() {
        super.start();

        /*
        https://glen.le.utah.gov/legcal/79926B1843F5F86BCC3DE12761245CB9

        [{
            committee: "Elected Officials and Judicial Compensation Commission",
            link: "https://le.utah.gov/committee/committee.jsp?year=2025&com=SPEEJC",
            mtgTime: "2025-09-08T9:00:00.000Z",
            mtgPlace: "110 Senate Building",
            mtgID: "20159"
        },
        ...]
         */

//        AT THIS JUNCTURE I DON'T THINK I NEED THIS DATA

        List<String> list = new ArrayList<>();

        if (true)
            throw new UnsupportedOperationException("this method needs an implementation");

        super.eventLog(this.getClass().getSimpleName(), "loaded/saved " + list.size() + " meeting calendar records");
    }
}
