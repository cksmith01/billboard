package com.cks.billboard.model.json;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class CommitteeDeserializer extends StdDeserializer<Committee> {

    public CommitteeDeserializer() {
        this(null);
    }

    public CommitteeDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public Committee deserialize(JsonParser jp, DeserializationContext ctxt)
            throws IOException, JsonProcessingException {

        JsonNode node = jp.getCodec().readTree(jp);

        JsonNode members = node.get("members");

        List<CommitteeMember> memberList = new ArrayList<>();
        if (members != null) {
            for (JsonNode member : members) {
                CommitteeMember _member = new CommitteeMember(
                        member.get("id").asText(),
                        member.get("position").asText(),
                        member.get("name").asText()
                );
                memberList.add(_member);
            }
        }

        return new Committee(
                node.get("id").asText(),
                node.get("description").asText(),
                node.get("link").asText(),
                memberList
        );
    }
}
