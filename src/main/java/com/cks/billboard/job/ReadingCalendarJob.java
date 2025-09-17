package com.cks.billboard.job;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;


/**
 * This job calls the API for reading calendar information, stores it on the server
 * so that it can be easily reloaded and then updates the cache (see DataCache)
 *
 * <p>NOTE: this is not currently implemented b/c the current data set is not available (b/c session isn't on)</p>
 */

@Component
public class ReadingCalendarJob extends BaseLoader {

    @Scheduled(cron = "0 0 1,23 * * *") // <-- every day at 6am and 6pm
    public void run() {
        super.start();

        List<String> list = new ArrayList<>();


        /*
        https://glen.le.utah.gov/calendars/79926B1843F5F86BCC3DE12761245CB9

        ... THERE'S NO DATA SO I CAN CODE THIS ONE :/

         */



        if (true)
            throw new UnsupportedOperationException("this method needs an implementation");



        super.eventLog(this.getClass().getSimpleName(), "loaded/saved " + list.size() + " reading calendar records");
    }
}
