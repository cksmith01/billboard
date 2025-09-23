package com.cks.billboard.job;

import com.cks.billboard.Constants;
import com.cks.billboard.model.json.Legislator;
import com.cks.billboard.model.json.LegislatorDeserializer;
import com.cks.billboard.service.DataCache;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

/**
 * This job calls the API for any changes to the legislators, stores it on the server
 * so that it can be easily reloaded and then updates the cache (see DataCache)
 */

@Component
public class LegislatorLoaderJob extends BaseLoader {

    Logger logger = Logger.getLogger(this.getClass().getName());

    @Value("${data.dir}")
    String dataDir;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    DataCache dataCache;

    @Scheduled(cron = "0 0 6,18 * * *") // <-- every day at 6am and 6pm
    public void run() throws IOException {

        super.start();

        List<Legislator> list = new ArrayList<>();
        JsonNode nodes = restClient.get()
                .uri("legislators/" + token)
                .retrieve().body(JsonNode.class);

        objectMapper.registerModule(
                new SimpleModule().addDeserializer(Legislator.class, new LegislatorDeserializer())
        );

        for (JsonNode node : nodes.get("legislators")) {
            list.add(objectMapper.readValue(node.toString(), Legislator.class));
        }

        dataCache.setLegislators(list);

        logger.info("loaded/cached legislators: " + list.size());

        super.writeFile(list, Constants.LEGISLATORS_JSON);

        super.eventLog(this.getClass().getSimpleName(), "loaded " + list.size() + " legislator records");
    }

}
