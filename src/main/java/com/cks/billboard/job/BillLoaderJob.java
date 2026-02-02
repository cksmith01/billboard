package com.cks.billboard.job;

import com.cks.billboard.Constants;
import com.cks.billboard.model.Bill;
import com.cks.billboard.model.json.*;
import com.cks.billboard.service.DataCache;
import com.cks.billboard.util.Dates;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;

/**
 * This job is the primary data set collector from the bill API
 * <li>query the list API</li>
 * <li>fetch the detail for each record (that has changed) and build a list of bill objects that contain all the data</li>
 * <li>store it on disk</li>
 * <li>update the cache</li>
 *
 * <p>NOTE: although this job is scheduled for every 15min it will only actually process on that interval
 * from December through March.  Otherwise, it will only run once per day.
 * </p>
 *
 * @author CKSmith
 */

@Component
public class BillLoaderJob extends BaseLoader {

    Logger log = Logger.getLogger(getClass().getName());

    @Value("${data.dir}")
    String dataDir;

    @Value("${throttle.delay}")
    Integer throttleDelay;

    @Value("${le.utah.gov.token}")
    String developerKey;

    @Value("${fiscal.limit}")
    Float fiscalLimit;

    @Autowired
    DataCache dataCache;

    Set<String> runDates = new TreeSet<>();

    boolean running = false;

    /**
     * @throws Exception
     */
//    @Scheduled(cron = "0 */2 * ? * *") // <-- every 5min
    @Scheduled(cron = "0 */15 * ? * *") // <-- every 15min
    public void run() throws Exception {

//        if (running) return;  // testing

        boolean run = false;
        int month = Calendar.getInstance().get(Calendar.MONTH);
        if (month == 11 || month < 3) {
            run = true;
        } else if (!runDates.contains(Dates.formatDBShort(null))) {
            run = true;
        }
        if (!run) {
            log.info("Skipping processing b/c we're off season, and its already run today");
            return;
        }

        super.start();

//        running = true;   // testing

        String session = dataCache.getDataYear() + "GS";
        log.info("restClient: " + restClient + " token: " + super.token + " throttleDelay: " + throttleDelay);

        // 1. Load the list that tells us if anything has changed
        List<BillPointer> list = loadList(session);

        List<Bill> billList = dataCache.getBillList();
        // convert to a map so we can easily look them up to see if we need to update the data
        Map<String, Bill> map = billList.stream().collect(
                Collectors.toMap(x -> x.getTrackingId(), x -> x));

        // 2. load the detail
        Map<String, Bill> bills = loadDetail(session, list, map);

        // sorted newest first...
        List<Bill> sorted = bills.values().stream()
                .sorted(Comparator.comparing(Bill::getLastActionDate).reversed())
                .collect(Collectors.toList());

        sorted.forEach(bill -> {
            if (bill.getFiscalTotal() > fiscalLimit) bill.setFiscalBill("Y");
        });

        // 3. save the data
        super.writeFile(sorted, Constants.BILLS_JSON);

        // 4. add to cache
        dataCache.setBillList(sorted);

        super.eventLog(getClass().getSimpleName(), "loaded/saved " + bills.size() + " bill records");

        runDates.add(Dates.formatDBShort(null));

//        running = false;  // testing
    }

    private List<BillPointer> loadList(String session) throws Exception {
        List<BillPointer> list = new ArrayList<>();

        JsonNode nodes = restClient.get()
                .uri("bills/" + session + "/billlist/" + token)
                .retrieve().body(JsonNode.class);

        objectMapper.registerModule(
                new SimpleModule().addDeserializer(BillPointer.class, new BillPointerDeserializer())
        );

        for (JsonNode node : nodes) {
            list.add(objectMapper.readValue(node.toString(), BillPointer.class));
        }

        log.info("Records found: " + list.size());

        return list;
    }

    private Map<String, Bill> loadDetail(String year, List<BillPointer> list, Map<String, Bill> map) throws Exception {

        Map<String, Bill> bills = new TreeMap<>();

        objectMapper.registerModule(
                new SimpleModule().addDeserializer(BillDetail.class, new BillDetailDeserializer())
        );

        int count = 0;

        BillBuilder builder = new BillBuilder();
        builder.setOwnerCodes(dataCache.getOwnerCodes());
        builder.setLegislators(dataCache.getLegislators());
        builder.setMissingElements(dataCache.getMissingElements());
        // builder.setDeveloperKey(developerKey);

        // TODO we need a mechanism to refresh the bill data against missingElements.json b/c that data may have chanaged

        for (BillPointer pointer : list) {
            // ignore if we have the most current version
            if (map.containsKey(pointer.getTrackingID())) {
                Bill bill = map.get(pointer.getTrackingID());
                if (bill.getUpdateTime().equals(pointer.getUpdatetime())) {
                    bills.put(bill.getTrackingId(), bill);
                    // missing elements data may have updated so let's make sure we have the latest...
                    builder.setMissingElements(bill);
                    //log.info("skipping: " + bill.getBillNumber() + " ... data hasn't changed");
                    continue;
                }
            }

            log.info("fetching detail for: " + pointer.getNumber() + "...");
            JsonNode node = restClient.get()
                    .uri("bills/" + year + "/" + pointer.getNumber() + "/" + token)
                    .retrieve().body(JsonNode.class);

            BillDetail detail = objectMapper.readValue(node.toString(), BillDetail.class);

            builder.setDetail(detail);
            Bill bill = builder.build();
            bill.setUpdateTime(pointer.getUpdatetime());

            bills.put(bill.getTrackingId(), bill);

            // We do this so that we don't call their server too often, they will block access if you do that
            try {
                Thread.sleep(throttleDelay);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }

        }
        return bills;
    }

}
