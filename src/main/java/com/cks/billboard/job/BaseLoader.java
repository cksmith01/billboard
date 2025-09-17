package com.cks.billboard.job;

import com.cks.billboard.EventLogable;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

@Component
public class BaseLoader extends EventLogable {

    Logger logger = Logger.getLogger(this.getClass().getName());

    @Autowired
    RestClient restClient;

    @Autowired
    ObjectMapper objectMapper;

    @Value("${le.utah.gov.token}")
    protected String token;
    @Value("${data.dir}")
    String dataDir;

    /**
     * @param list
     * @param fileName
     * @throws IOException
     */
    protected <T> void writeFile(List<T> list, String fileName) throws IOException {

        File targetFile = new File(dataDir + fileName);
        if (targetFile.exists()) {
            targetFile.delete();
        }

        objectMapper.writeValue(targetFile, list);

        logger.info(targetFile.getAbsolutePath() + " created/updated");
    }

}
