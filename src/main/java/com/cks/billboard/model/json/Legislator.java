package com.cks.billboard.model.json;

import java.util.Map;

public record Legislator(String fullName,
                         String formatName,
                         String id,
                         String imgUrl,
                         String house,
                         String party,
                         String email,
                         String position,
                         Map<String, String> commiteeList
) {
}
