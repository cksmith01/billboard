package com.cks.billboard.model.json;

import java.util.List;

public record Committee (String id, String description, String link, List<CommitteeMember> members) {
}
