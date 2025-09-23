package com.cks.billboard.model.json;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;

public class BillPointerDeserializer extends StdDeserializer<BillPointer> {

    public BillPointerDeserializer() {
        this(null);
    }

    public BillPointerDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public BillPointer deserialize(JsonParser jp, DeserializationContext ctxt)
            throws IOException, JsonProcessingException {
        JsonNode node = jp.getCodec().readTree(jp);
        String number = node.get("number").asText();
        String trackingID = node.get("trackingID").asText();
        String updatetime = node.get("updatetime").asText();
        String lastActionTime = node.get("lastActionTime").asText();

        updatetime = strip(updatetime);
        lastActionTime = strip(lastActionTime);

        return new BillPointer(number, trackingID, updatetime, lastActionTime);
    }

    private String strip(String time) {
        if (time != null && time.length() > 0 && time.indexOf(".") > -1) {
            return time.substring(0, time.lastIndexOf("."));
        }
        return time;
    }
}
