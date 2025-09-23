package com.cks.billboard.model.json;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data
@NoArgsConstructor
@ToString
public class BillDetail {

    private String trackingId;
    private String year;
    private String sessionID;
    private String sessionIndex;
    private String billNumber;
    private String billNumberShort;
    private String billNumberLong;
    private String fileNumber;
    private String shortTitle;
    private String currentSubVersion;
    private String currentMinVersion;
    private String primeSponsor;
    private String primeSponsorName;
    private String primeSponsorHouse;
    private String floorSponsor;
    private String floorSponsorName;
    private String floorSponsorHouse;
    private String generalProvisions;
    private String highlightedProvisions;
    private String moniesAppropriated;
    private String draftingAttorney;
    private String fiscalAnalyst;
    private String lastAction;
    private String lastActionOwner;
    private String lastActionDate;

    private String subjectList;
    private String sectionsList;

    private List<ActionHistory> actionHistory;


    //    private List<ActionHistory> actionHistoryList;
//    private List<Object> agendaList; // empty in example
//    private List<Object> recommendingCommitteeList; // empty in example
//    private List<BillVersion> billVersionList;
//    private List<FloorDebate> floorDebateList;
//
//
//    public static class BillVersion {
//        private boolean activeVersion;
//        private boolean hasEnrolled;
//        private List<String> coSponsorList;
//        private List<Subject> subjectList;
//        private List<String> sectionAffectedList;
//        private String minorVersion;
//        private List<BillDoc> billDocs;
//        private String subVersion;
//        private String subTrackID;
//        private String versionSponsorName;
//        private String versionSponsorHouse;
//        private String billNumberShort;
//        private String billNumber;
//        private String versionSponsor;
//
//        public static class Subject {
//            private String code;
//            private String description;
//            // getters and setters
//        }
//
//        public static class BillDoc {
//            private String subVersion;
//            private String billNumber;
//            private String fileName;
//            private String fileType;
//            private String fileDate;
//            private String url;
//            private String chamber;
//            private String shortDesc;
//            private int intVal1;
//            private String strVal1;
//            private String strVal2;
//            private String strVal3;
//            // getters and setters
//        }
//    }
//
//    public static class FloorDebate {
//        private String markerID;
//        private String dayOfSession;
//        private String house;
//        private String description;
//        private String sessionDate;
//        // getters and setters
//    }

}

