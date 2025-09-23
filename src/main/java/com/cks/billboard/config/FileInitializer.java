package com.cks.billboard.config;

import com.cks.billboard.Constants;
import com.cks.billboard.job.CommitteeLoaderJob;
import com.cks.billboard.job.LegislatorLoaderJob;
import com.cks.billboard.job.MissingDataLoader;
import com.cks.billboard.service.DataCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.logging.Logger;

/**
 * This job checks for supporting json files that the application needs for a complete data set.
 * If they do not exist it will kickoff three jobs that load that data so it is available when the
 * main job (see BillLoaderJob) runs
 * @author CKSmith
 */

@Component
@Order(2)
public class FileInitializer implements CommandLineRunner {

    Logger logger = Logger.getLogger(this.getClass().getName());

    @Autowired
    DataCache dataCache;

    @Value("${data.dir}")
    String dataDir;

    @Autowired
    LegislatorLoaderJob legislatorLoaderJob;

    @Autowired
    CommitteeLoaderJob committeeLoaderJob;

    @Autowired
    MissingDataLoader missingDataLoader;

    @Override
    public void run(String... args) throws Exception {

        logger.info("Checking for missing data files ...");

        // check for legislators
        File targetFile = new File(dataDir + Constants.LEGISLATORS_JSON);
        if (!targetFile.exists()) {
            logger.info(targetFile.getName() + " is missing, initiating loader job...");
            legislatorLoaderJob.run();
        } else {
            logger.info(targetFile.getName() + " found!");
        }

        // check for committees
        targetFile = new File(dataDir + Constants.COMMITTEES_JSON);
        if (!targetFile.exists()) {
            logger.info(targetFile.getName() + " is missing, initiating loader job...");
            committeeLoaderJob.run();
        } else {
            logger.info(targetFile.getName() + " found!");
        }

        // check for missing elements
        targetFile = new File(dataDir + Constants.MISSING_ELEMENTS_JSON);
        if (!targetFile.exists()) {
            logger.info(targetFile.getName() + " is missing, initiating loader job...");
            missingDataLoader.run();
        } else {
            logger.info(targetFile.getName() + " found!");
        }

        logger.info("Missing file check completed!");

    }
}
