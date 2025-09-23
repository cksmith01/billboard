package com.cks.billboard.job;

import com.cks.billboard.Constants;
import com.cks.billboard.model.Bill;
import com.cks.billboard.model.LegislativeCode;
import com.cks.billboard.model.json.Committee;
import com.cks.billboard.model.json.Legislator;
import com.cks.billboard.model.json.MissingElement;
import com.cks.billboard.model.json.StandingCommittee;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Component
public class JsonLoader {

    @Value("${data.dir}")
    String dataDir;

    @Autowired
    ObjectMapper objectMapper;

    public List<LegislativeCode> getActionAndOwnerCodes() throws IOException {

        TypeReference<List<LegislativeCode>> typeReference = new TypeReference<List<LegislativeCode>>() {
        };
        InputStream inputStream = TypeReference.class.getResourceAsStream("/data/" + Constants.OWNER_AND_ACTIONS_CODES_JSON);
        List<LegislativeCode> codes = objectMapper.readValue(inputStream, typeReference);

        return codes;
    }

    public List<Legislator> getLegislators() throws IOException {

        TypeReference<List<Legislator>> typeReference = new TypeReference<List<Legislator>>() {
        };
        FileInputStream fis = new FileInputStream(dataDir + Constants.LEGISLATORS_JSON);
        List<Legislator> list = objectMapper.readValue(fis, typeReference);

        return list;
    }

    public List<StandingCommittee> getStandingCommittees() throws IOException {

        TypeReference<List<StandingCommittee>> typeReference = new TypeReference<List<StandingCommittee>>() {
        };
        InputStream inputStream = TypeReference.class.getResourceAsStream("/data/" + Constants.STANDING_COMMITTEES_JSON);
        List<StandingCommittee> list = objectMapper.readValue(inputStream, typeReference);

        return list;
    }

    public List<Bill> getBills() throws IOException {

        List<Bill> list = new ArrayList<>();

        try {
            TypeReference<List<Bill>> typeReference = new TypeReference<List<Bill>>() {
            };
            FileInputStream fis = new FileInputStream(dataDir + Constants.BILLS_JSON);
            list = objectMapper.readValue(fis, typeReference);

        } catch (IOException e) {
            // eat it
        }

        return list;
    }

    public Map<String, Committee> getCommittees() throws IOException {

        Map<String, Committee> map = new TreeMap<>();

        try {
            TypeReference<List<Committee>> typeReference = new TypeReference<List<Committee>>() {
            };
            FileInputStream fis = new FileInputStream(dataDir + Constants.COMMITTEES_JSON);
            List<Committee> list = objectMapper.readValue(fis, typeReference);

            list.stream().forEach(committee -> {
                map.put(committee.id(), committee);
            });

        } catch (IOException e) {
            // eat it
        }

        return map;
    }

    public List<MissingElement> getMissingElements() throws IOException {

        List<MissingElement> list = new ArrayList<>();

        try {
            TypeReference<List<MissingElement>> typeReference = new TypeReference<List<MissingElement>>() {
            };
            FileInputStream fis = new FileInputStream(dataDir + Constants.MISSING_ELEMENTS_JSON);
            list = objectMapper.readValue(fis, typeReference);

        } catch (IOException e) {
            // eat it
        }

        return list;
    }

}