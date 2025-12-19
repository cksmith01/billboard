package com.cks.billboard.job;

import com.cks.billboard.Constants;
import com.cks.billboard.model.json.MissingElement;
import com.cks.billboard.service.DataCache;
import com.cks.billboard.util.Strings;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.*;
import java.util.logging.Logger;

/**
 * The API data sets don't include the following:
 * <li>onetime funding</li>
 * <li>ongoing funding</li>
 * <li>effective date</li>
 * ... this job is used to supplement the missing data from
 * the bigboard app that I built while at the legislature.
 * <p>
 * Note: At some point they will remove the app!
 *
 * @author CKSmith
 */

@Component
public class MissingDataLoader extends BaseLoader {

    Logger logger = Logger.getLogger(this.getClass().getName());

    @Autowired
    DataCache dataCache;

    //        @Scheduled(cron = "0 */1 * ? * *") // <-- every min
    // @Scheduled(cron = "0 0 * * * *") // ... once per hour
    @Scheduled(cron = "0 0 * * JAN-MAR ?") // ... once per hour every day in jan thru mar
    public void run() throws Exception {

        List<MissingElement> list = new ArrayList<>();

        RestClient _restClient =
                RestClient.builder().baseUrl("https://s.utleg.gov/bigboard/bill/list/").build();

        JsonNode nodes = _restClient.get()
                .uri("" + dataCache.getDataYear())
                .retrieve().body(JsonNode.class);

        for (JsonNode node : nodes) {

            long onetime = 0l;
            long ongoing = 0l;
            String _onetime = node.get("onetime").asText();
            String _ongoing = node.get("ongoing").asText();
            if (Strings.notBlank(_onetime) && !_onetime.equals("null"))
                onetime = Double.valueOf(_onetime).longValue();
            if (Strings.notBlank(_ongoing) && !_ongoing.equals("null"))
                ongoing = Double.valueOf(_ongoing).longValue();

//            String bn = node.get("billNumber").asText();
//            if (bn.equals("SB0001")) {
//                System.out.println(node.toPrettyString());
//                System.out.println(_onetime +": "+onetime);
//                System.out.println(_ongoing +": "+ongoing);
//            }

            list.add(
                    new MissingElement(node.get("fileNumber").asText(),
                            node.get("billNumber").asText(),
                            onetime,
                            ongoing,
                            node.get("effectiveDate").asText(),
                            node.get("lrgcAnalyst").asText()
                    )
            );
        }

//        list.stream().forEach(i -> {
//            if (i.billNumber().equals("SB0001"))
//                System.out.println(i.billNumber() + ": onetime: " + i.onetime() + " ongoing: " + i.onetime());
//        });
//
        super.writeFile(list, Constants.MISSING_ELEMENTS_JSON);

        dataCache.setMissingElements(list);

        super.eventLog(this.getClass().getSimpleName(), "loaded " + list.size() + " missing elements records");

    }
}
