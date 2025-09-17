package com.cks.billboard.model.json;

public record ActionHistory (
        String description,
        String owner,
        String actionDate,
        String voteID,
        String voteStr,
        String actionCode) {
}
