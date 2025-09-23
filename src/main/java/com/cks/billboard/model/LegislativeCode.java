package com.cks.billboard.model;

public class LegislativeCode {
    private String code;
    private String description;
    private String type;

    // Constructors
    public LegislativeCode() {}

    public LegislativeCode(String code, String description, String type) {
        this.code = code;
        this.description = description;
        this.type = type;
    }

    // Getters and setters
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    @Override
    public String toString() {
        return "LegislativeAction{" +
                "code='" + code + '\'' +
                ", description='" + description + '\'' +
                ", type='" + type + '\'' +
                '}';
    }
}

