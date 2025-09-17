package com.cks.billboard.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Bill {
    private String fileNumber;
    private String billNumber;
    private String realBillNumber;
    private String sponsorChamber;
    private String primarySponsor;
    private String leadershipPosition;
    private String sponsorID;
    private String floorSponsor;
    private String flLeadershipPosition;
    private String floorSponsorID;
    private String attorney;
    private String lrgcAnalyst;
    private String lfaAnalyst;
    private String owner;
    private String ownerDesc;
    private String shortTitle;
    private String longTitle;
    private Long onetime = 0l;
    private Long ongoing = 0l;
    private Long fiscalTotal = 0l;
    private String lastActionDesc;
    private String lastActionCode;
    private String actionCodeDesc;
    private String lastActionDate;
    private String effectiveDate;
    private String link;
    private String trackingId;
    private String updateTime;

    private String sectionsAffected;
    private String subjectList;
    private String monies;
    private String provisions;
    private String clauses;

    private String HRead3;
    private String HPass3;
    private String HComAction;
    private String HComActionDate;
    private String SRead3;
    private String SComAction;
    private String SComActionDate;
    private String SPass3;
    private String GovAction;
    private String GovDate;
    private String failedOnFloorDate;
    private String failedOnFloorAction;

}
