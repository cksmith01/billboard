package com.cks.billboard.service;

import com.cks.billboard.EventLogable;
import com.cks.billboard.job.JsonLoader;
import com.cks.billboard.model.Bill;
import com.cks.billboard.model.LegislativeCode;
import com.cks.billboard.model.json.Committee;
import com.cks.billboard.model.json.Legislator;
import com.cks.billboard.model.json.MissingElement;
import com.cks.billboard.model.json.StandingCommittee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Component
public class DataCache extends EventLogable {

    Logger log = Logger.getLogger(this.getClass().getName());

    @Autowired
    JsonLoader jsonLoader;

    private boolean initialized = false;
    private int dataYear = Calendar.getInstance().get(Calendar.YEAR);

    List<Bill> bills = new ArrayList<>();
    List<LegislativeCode> actionAndWwnerCodes = new ArrayList<>();
    List<LegislativeCode> ownerCodes = new ArrayList<>();
    List<LegislativeCode> actionCodes = new ArrayList<>();
    List<Legislator> legislators = new ArrayList<>();
    List<StandingCommittee> standingCommittees = new ArrayList<>();
    Map<String, Committee> committees;
    List<MissingElement> missingElements = new ArrayList<>();

    public void init() {

        // make sure this is only called once
        if (initialized) return;

        this.start();

        Calendar cal = Calendar.getInstance();
        this.dataYear = cal.get(Calendar.YEAR);
        if (cal.get(Calendar.MONTH) == 11 && cal.get(Calendar.DATE) >= 15) {
            this.dataYear++;
        }

        List<String> messages = new ArrayList<>();

        try {
            actionAndWwnerCodes = jsonLoader.getActionAndOwnerCodes();
            messages.add("owner and action codes loaded: " + actionAndWwnerCodes.size());

            ownerCodes =
                    actionAndWwnerCodes.stream().filter(c -> c.getType().equals("owner"))
                            .collect(Collectors.toList());
            messages.add("owner codes: " + ownerCodes.size());

            actionCodes =
                    actionAndWwnerCodes.stream().filter(c -> c.getType().equals("action"))
                            .collect(Collectors.toList());
            messages.add("action codes: " + actionCodes.size());

        } catch (IOException ioe) {
            messages.add("Error: " + ioe.getMessage());
        }

        try {
            legislators = jsonLoader.getLegislators();
            messages.add("legislators loaded: " + legislators.size());
        } catch (IOException ioe) {
            messages.add("Error: " + ioe.getMessage());
        }

        try {
            standingCommittees = jsonLoader.getStandingCommittees();
            messages.add("standing committees loaded: " + standingCommittees.size());
        } catch (IOException ioe) {
            messages.add("Error: " + ioe.getMessage());
        }

        try {
            bills = jsonLoader.getBills();
            messages.add("bills loaded: " + bills.size());
        } catch (IOException ioe) {
            messages.add("Error: " + ioe.getMessage());
        }

        try {
            committees = jsonLoader.getCommittees();
            messages.add("committees loaded: " + committees.size());
        } catch (IOException ioe) {
            messages.add("Error: " + ioe.getMessage());
        }

        try {
            missingElements = jsonLoader.getMissingElements();
            messages.add("missing elements loaded: " + missingElements.size());
        } catch (IOException ioe) {
            messages.add("Error: " + ioe.getMessage());
        }

        initialized = true;

        super.eventLog(this.getClass().getSimpleName(), messages.toString());
    }

    public int getDataYear() {
        return this.dataYear;
    }

    public void setDataYear(int year) {
        this.dataYear = year;
    }

    public List<Bill> getBillList() {
        return bills;
    }

    public synchronized void setBillList(List<Bill> list) {
        this.bills = list;
    }

    public List<LegislativeCode> getActionAndWwnerCodes() {
        return actionAndWwnerCodes;
    }

    public List<LegislativeCode> getOwnerCodes() {
        return ownerCodes;
    }

    public List<LegislativeCode> getActionCodes() {
        return actionCodes;
    }

    public List<Legislator> getLegislators() {
        return legislators;
    }

    public void setLegislators(List<Legislator> legislators) {
        this.legislators = legislators;
    }

    public List<StandingCommittee> getStandingCommittees() {
        return this.standingCommittees;
    }

    public void setCommittees(Map<String, Committee> committees) {
        this.committees = committees;
    }

    public Map<String, Committee> getCommittees() {
        return this.committees;
    }

    public List<MissingElement> getMissingElements() {
        return missingElements;
    }

    public void setMissingElements(List<MissingElement> missingElements) {
        this.missingElements = missingElements;
    }
}
