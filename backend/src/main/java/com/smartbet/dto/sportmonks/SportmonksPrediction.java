package com.smartbet.dto.sportmonks;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SportmonksPrediction {
    private Long id;
    
    @JsonProperty("fixture_id")
    private Long fixtureId;
    
    @JsonProperty("type_id")
    private Long typeId;
    
    private String predictions;
    
    @JsonProperty("is_won")
    private Boolean isWon;
    
    private Type type;
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Type {
        private Long id;
        private String name;
        private String code;
        
        @JsonProperty("developer_name")
        private String developerName;
        
        @JsonProperty("model_type")
        private String modelType;
        
        @JsonProperty("stat_group")
        private String statGroup;
    }
}
