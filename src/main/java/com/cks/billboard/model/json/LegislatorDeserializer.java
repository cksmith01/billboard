package com.cks.billboard.model.json;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

public class LegislatorDeserializer extends StdDeserializer<Legislator> {

    Logger logger = Logger.getLogger(this.getClass().getName());

    public LegislatorDeserializer() {
        this(null);
    }

    public LegislatorDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public Legislator deserialize(JsonParser jp, DeserializationContext ctxt)
            throws IOException, JsonProcessingException {

        JsonNode node = jp.getCodec().readTree(jp);

        JsonNode committees = node.get("committees");
        Map<String, String> commiteeList = new HashMap<>();
        if (committees != null) {
            for (JsonNode committee : committees) {
                commiteeList.put(
                        committee.get("committee").asText(),
                        committee.get("name").asText());
            }
        }

        String fullName = "", formatName = "", id = "", image = "", house = "", party = "", email = "", position = "";

        try {
            fullName = safeRead(node, "fullName");
            formatName = safeRead(node, "formatName");
            id = safeRead(node, "id");
            image = safeRead(node, "image");
            house = safeRead(node, "house");
            party = safeRead(node, "party");
            email = safeRead(node, "email");    // this can be absent
            position = safeRead(node, "position");  // this is often absent
        } catch (Exception e) {
            logger.severe(e.getMessage());
        }

        return new Legislator(
                fullName, formatName, id, image, house, party, email, position,
                commiteeList
        );

    }

    private String safeRead(JsonNode node, String property) {
        String val = "";
        try {
            val = node.get(property).asText();
        } catch (Exception e) {
            logger.info("error ["+e.getMessage()+"] reading property: " + property + " in JsonNode");
        }
        return val;
    }
}
