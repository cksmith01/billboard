package com.cks.billboard.model.json;

public record MissingElement(String fileNumber,
                             String billNumber,
                             long onetime,
                             long ongoing,
                             String effectiveDate,
                             String lrgcAnalyst) {
}
