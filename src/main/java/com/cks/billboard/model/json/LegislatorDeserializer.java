package com.cks.billboard.model.json;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class LegislatorDeserializer extends StdDeserializer<Legislator> {

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
            fullName = node.get("fullName").asText();
            formatName = node.get("formatName").asText();
            id = node.get("id").asText();
            image = node.get("image").asText();
            house = node.get("house").asText();
            party = node.get("party").asText();
            email = node.get("email").asText();
            try {
                position = node.get("position").asText();
            } catch (Exception e) {
                // eat it - if they don't have a leadership role the prop won't be there
            }
        } catch (Exception e) {
            System.err.println(e.getMessage());
        }

        return new Legislator(
                fullName, formatName, id, image, house, party, email, position,
                commiteeList
        );

    }
}
