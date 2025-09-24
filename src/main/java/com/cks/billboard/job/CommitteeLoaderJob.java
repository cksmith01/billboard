package com.cks.billboard.job;

import com.cks.billboard.Constants;
import com.cks.billboard.model.json.Committee;
import com.cks.billboard.model.json.CommitteeDeserializer;
import com.cks.billboard.service.DataCache;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.TreeMap;

/**
 * This job calls the API for committee information, stores it on the server
 * so that it can be easily reloaded and then updates the cache (see DataCache)
 *
 * @author CKSmith
 */

@Component
public class CommitteeLoaderJob extends BaseLoader {

    @Autowired
    DataCache dataCache;

    @Scheduled(cron = "0 0 6 * * *") // <-- once a day at 6am
    public void run() throws IOException {

        super.start();

        Map<String, Committee> list = new TreeMap<>();
        JsonNode nodes = restClient.get()
                .uri("committees/" + token)
                .retrieve().body(JsonNode.class);

        objectMapper.registerModule(
                new SimpleModule().addDeserializer(Committee.class, new CommitteeDeserializer())
        );

        for (JsonNode node : nodes.get("committees")) {
            Committee committee = objectMapper.readValue(node.toString(), Committee.class);
            list.put(committee.id(), committee);
        }

        super.writeFile(list.values().stream().toList(), Constants.COMMITTEES_JSON);

        dataCache.setCommittees(list);

        super.eventLog(this.getClass().getSimpleName(), "loaded/saved " + list.size() + " committee records");

    }
}
