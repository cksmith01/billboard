package com.cks.billboard.job;

import com.cks.billboard.service.DataCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Calendar;

/**
 * If the application runs over long periods of time this will increment the
 * data year on Dec 15 as new bills are becoming public
 *
 * @author CKSmith
 */

@Component
public class YearCheckJob {

    @Autowired
    DataCache dataCache;

    @Scheduled(cron = "0 0 1 * * *") // <-- every day at 1am
    public void run() {

        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        if (cal.get(Calendar.MONTH) == 11 && cal.get(Calendar.DATE) >= 15) {
            year++;
        }

        dataCache.setDataYear(year);
    }
}
