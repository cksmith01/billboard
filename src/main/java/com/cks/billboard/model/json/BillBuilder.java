package com.cks.billboard.model.json;

import com.cks.billboard.model.Bill;
import com.cks.billboard.model.LegislativeCode;
import com.cks.billboard.util.Strings;

import java.util.Calendar;
import java.util.List;
import java.util.Optional;

public class BillBuilder {

    private String developerKey;

    private BillDetail detail;
    private List<Legislator> legislators;
    private List<LegislativeCode> ownerCodes;
    private List<MissingElement> missingElements;

    public void setDeveloperKey(String developerKey) {
        this.developerKey = developerKey;
    }

    public BillDetail getDetail() {
        return detail;
    }

    public void setDetail(BillDetail detail) {
        this.detail = detail;
    }

    public void setLegislators(List<Legislator> legislators) {
        this.legislators = legislators;
    }

    public void setOwnerCodes(List<LegislativeCode> ownerCodes) {
        this.ownerCodes = ownerCodes;
    }

    public void setMissingElements(List<MissingElement> missingElements) {
        this.missingElements = missingElements;
    }

    public Bill build() {
        Bill bill = new Bill();

        bill.setTrackingId(detail.getTrackingId());

        bill.setBillNumber(detail.getBillNumber());
        bill.setRealBillNumber(detail.getBillNumberLong());
        bill.setFileNumber(detail.getFileNumber());
        bill.setShortTitle(detail.getShortTitle());
        bill.setLongTitle(detail.getGeneralProvisions());

        String provisions = detail.getHighlightedProvisions();
        if (provisions != null) {
            provisions = provisions.replaceAll("<[^>]*>", " ");
        }
        bill.setProvisions(provisions);

        String monies = detail.getMoniesAppropriated();
        if (monies != null) {
            monies = monies.replaceAll("<[^>]*>", " ");
        }
        bill.setMonies(monies);

        if (Strings.notBlank(detail.getBillNumber())) {
            if (detail.getBillNumber().startsWith("H")) {
                bill.setSponsorChamber("Rep.");
            } else if (detail.getBillNumber().startsWith("S")) {
                bill.setSponsorChamber("Sen.");
            }
        }

        bill.setLastActionCode(detail.getLastAction());
        bill.setActionCodeDesc(detail.getLastAction());
        bill.setLastActionDate(detail.getLastActionDate());

        bill.setSponsorID(detail.getPrimeSponsor());
        bill.setPrimarySponsor(detail.getPrimeSponsorName());

        bill.setFloorSponsor(detail.getFloorSponsorName());
        bill.setFloorSponsorID(detail.getFloorSponsor());

        bill.setAttorney(detail.getDraftingAttorney());
        bill.setLfaAnalyst(detail.getFiscalAnalyst());

        bill.setSectionsAffected(detail.getSectionsList());
        bill.setSubjectList(detail.getSubjectList());

        /*
        You can't stream/filter this b/c a bill can have mulitple
        actions of the same type.  For example a bill can be modified
        in the opposite chamber and then it will have to be re-read in
        the originating chamber.  We want the last action of any given
        type and this will handle that
         */
        for (ActionHistory i : detail.getActionHistory()) {
            switch (i.actionCode()) {
                case "SCAFAV":
                    bill.setSComAction("SCAFAV");
                    bill.setSComActionDate(i.actionDate());
                    continue;
                case "SCAFAVFAIL":
                    bill.setSComAction("SCAFAVFAIL");
                    bill.setSComActionDate(i.actionDate());
                    continue;
                case "HCAFAV":
                    bill.setHComAction("HCAFAV");
                    bill.setHComActionDate(i.actionDate());
                    continue;
                case "HCAFAVFAIL":
                    bill.setHComAction("HCAFAVFAIL");
                    bill.setHComActionDate(i.actionDate());
                    continue;
                case "SPASS3":
                    bill.setSPass3(i.actionDate());
                    continue;
                case "SPASS23SP":
                    bill.setSPass3(i.actionDate());
                    continue;
                case "SREAD3":
                    bill.setSRead3(i.actionDate());
                    continue;
                case "HPASS3":
                    bill.setHPass3(i.actionDate());
                    continue;
                case "HREAD3":
                    bill.setHRead3(i.actionDate());
                    continue;
                case "HFAIL":
                    bill.setFailedOnFloorAction("HFAIL");
                    bill.setFailedOnFloorDate(i.actionDate());
                    continue;
                case "SFAIL":
                    bill.setFailedOnFloorAction("SFAIL");
                    bill.setFailedOnFloorDate(i.actionDate());
                    continue;
                case "GSIGN":
                    bill.setGovAction("GSIGN");
                    bill.setGovDate(i.actionDate());
                    continue;
                case "GVETO":
                    bill.setGovAction("GVETO");
                    bill.setGovDate(i.actionDate());
                    continue;
                case "GOVLVETO":
                    bill.setGovAction("GOVLVETO");
                    bill.setGovDate(i.actionDate());
                    continue;
                case "GNOSIGN":
                    bill.setGovAction("GNOSIGN");
                    bill.setGovDate(i.actionDate());
                    continue;
                default:
                    // ignore
            }
        }

        // loop through action history and set the values
        if (Strings.isBlank(bill.getLastActionDesc())) {
            if (detail.getActionHistory() != null && detail.getActionHistory().size() > 0) {
                ActionHistory _ah = detail.getActionHistory().get(detail.getActionHistory().size() - 1);
                bill.setLastActionDesc(_ah.description());
                bill.setLastActionDate(_ah.actionDate());
                bill.setLastActionCode(_ah.actionCode());
            }
        }

        int year = Calendar.getInstance().get(Calendar.YEAR);
        if (Strings.notBlank(detail.getSessionID())) {
            try {
                year = Integer.parseInt(detail.getSessionID().substring(0, 4));
            } catch (NumberFormatException e) { /* just eat it */ }
        }
        bill.setLink("https://le.utah.gov/~" + year + "/bills/static/" + bill.getBillNumber() + ".html");

        // example: https://glen.le.utah.gov/bills/2018GS/HB0001/<developer key>
        bill.setJson("https://glen.le.utah.gov/bills/" + detail.getSessionID() + "/" + bill.getBillNumber() + "/");

        if (Strings.isBlank(bill.getOwner()) && Strings.notBlank(detail.getLastActionOwner())) {
            Optional<LegislativeCode> code =
                    ownerCodes.stream().filter(i ->
                            i.getDescription().equalsIgnoreCase(detail.getLastActionOwner())
                    ).findFirst();
            code.ifPresent(c -> {
                bill.setOwner(c.getCode());
                bill.setOwnerDesc(c.getDescription());
            });
        }

        if (legislators != null && legislators.size() > 0) {
            legislators.stream().forEach(l -> {
                if (l.id().equals(bill.getSponsorID())) {
                    bill.setLeadershipPosition(l.position());
                }
                if (l.id().equals(bill.getFloorSponsorID())) {
                    bill.setFlLeadershipPosition(l.position());
                }
            });
        }

        this.setMissingElements(bill);

        return bill;
    }

    public void setMissingElements(Bill bill) {
        if (missingElements != null && missingElements.size() > 0) {
            missingElements.stream().forEach(e -> {
                if (e.fileNumber().equals(bill.getFileNumber())) {
                    bill.setOnetime(e.onetime());
                    bill.setOngoing(e.ongoing());
                    bill.setFiscalTotal(e.onetime() + e.ongoing());
                    bill.setEffectiveDate(e.effectiveDate());
                    bill.setLrgcAnalyst(e.lrgcAnalyst());
                }
            });
        }
    }
}
