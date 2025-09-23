package com.cks.billboard.model.json;

import com.cks.billboard.util.Dates;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.text.ParseException;
import java.util.*;

public class BillDetailDeserializer extends StdDeserializer<BillDetail> {

    public BillDetailDeserializer() {
        this(null);
    }

    public BillDetailDeserializer(Class<?> vc) {
        super(vc);
    }

    private String dateFormatLong = "M/d/yyyy h:mm a";
    private String dateFormat = "M/d/yyyy";

    @Override
    public BillDetail deserialize(JsonParser jp, DeserializationContext ctxt)
            throws IOException, JsonProcessingException {

        BillDetail item = new BillDetail();

        JsonNode node = jp.getCodec().readTree(jp);

        item.setTrackingId(node.get("trackingID").asText());

        item.setYear(node.get("year").asText());
        item.setSessionID(node.get("sessionID").asText());
        item.setBillNumberShort(node.get("billNumberShort").asText());
        item.setBillNumber(node.get("billNumber").asText());
        item.setBillNumberLong(node.get("billNumberLong").asText());
        item.setFileNumber(node.get("fileNumber").asText());
        item.setShortTitle(node.get("shortTitle").asText());
        item.setCurrentMinVersion(node.get("currentSubVersion").asText());
        item.setCurrentMinVersion(node.get("currentMinVersion").asText());

        item.setPrimeSponsor(node.get("primeSponsor").asText());
        item.setPrimeSponsorName(cleanSponsor(node.get("primeSponsorName").asText()));
        item.setPrimeSponsorHouse(node.get("primeSponsorHouse").asText());

        item.setFloorSponsor(node.get("floorSponsor").asText());
        item.setFloorSponsorName(cleanSponsor(node.get("floorSponsorName").asText()));
        item.setFloorSponsorHouse(node.get("floorSponsorHouse").asText());

        item.setGeneralProvisions(node.get("generalProvisions").asText());
        item.setHighlightedProvisions(node.get("highlightedProvisions").asText());
        item.setMoniesAppropriated(node.get("moniesAppropriated").asText());

        item.setDraftingAttorney(node.get("draftingAttorney").asText());
        item.setFiscalAnalyst(node.get("fiscalAnalyst").asText());
        item.setLastAction(node.get("lastAction").asText());
        item.setLastActionOwner(node.get("lastActionOwner").asText());
        item.setLastActionDate(convertDate(node.get("lastActionDate").asText()));

        if (node.get("actionHistoryList") != null) {
            JsonNode history = node.get("actionHistoryList");
            ArrayList<ActionHistory> historyList = new ArrayList<>();
            if (history != null) {
                for (JsonNode hist : history) {
                    ActionHistory action = new ActionHistory(
                            hist.get("description").asText(),
                            hist.get("owner").asText(),
                            convertDate(hist.get("actionDate").asText()),
                            hist.get("voteID").asText(),
                            hist.get("voteStr").asText(),
                            hist.get("actionCode").asText());
                    historyList.add(action);
                }
            }
            item.setActionHistory(historyList);
        }

        if (node.get("billVersionList") != null) {
            JsonNode versions = node.get("billVersionList");
            if (versions != null) {
                // Look for an "active" version, and if you can't find one use the first record
                JsonNode version = null;
                for (JsonNode _version : versions) {
                    if ("true".equals(_version.get("activeVersion").asText())) {
                        version = _version;
                        break;
                    }
                }
                if (version == null && versions.size() > 0) {
                    version = versions.get(0);
                }
                if (version != null) {
                    // Set is used to handle the fact that there are duplicates in the data...
                    Set<String> set = new HashSet<>();
                    JsonNode subjectList = version.get("subjectList");
                    if (subjectList != null) {
                        for (JsonNode subject : subjectList) {
                            set.add(subject.get("description").asText());
                        }
                        item.setSubjectList(String.join(", ", set));
                    }
                    JsonNode sectionAffectedList = version.get("sectionAffectedList");
                    if (sectionAffectedList != null) {
                        set = new HashSet<>();
                        for (JsonNode section : sectionAffectedList) {
                            set.add(section.get("secNo").asText());
                        }
                        item.setSectionsList(String.join(", ", set));
                    }
                }
            }

        }

        return item;
    }

    private String convertDate(String aDate) {
        if (aDate == null || "".equals(aDate)) {
            return "";
        }
        try {
            Date _date;
            if (aDate.indexOf(":") > -1)
                _date = Dates.parse(aDate, dateFormatLong);
            else
                _date = Dates.parse(aDate, dateFormat);
            return Dates.formatDB(_date);
        } catch (ParseException e) {
            System.err.println("error parsing date: " + aDate);
            return aDate;
        }
    }

    private String cleanSponsor(String sponsor) {
        if (sponsor != null && sponsor.startsWith("Sen.") || sponsor.startsWith("Rep.")) {
            return sponsor.substring(sponsor.indexOf(" ")+1);
        }
        return sponsor;
    }
}
