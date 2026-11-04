package com.smartbet.dto.sportmonks;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SportmonksFixture {
    private Long id;
    private String name;
    
    @JsonProperty("starting_at")
    private String startingAt;
    
    @JsonProperty("result_info")
    private String resultInfo;
    
    private String leg;
    private String details;
    private Integer length;
    private String placeholder;
    
    @JsonProperty("has_odds")
    private Boolean hasOdds;
    
    @JsonProperty("starting_at_timestamp")
    private Long startingAtTimestamp;
    
    private League league;
    private Season season;
    private Stage stage;
    private State state;
    private List<Participant> participants;
    private List<Prediction> predictions;
    private List<Score> scores;
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class League {
        private Long id;
        private String name;
        
        @JsonProperty("short_code")
        private String shortCode;
        
        @JsonProperty("image_path")
        private String imagePath;
        
        private String type;
        private Country country;
    }
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Country {
        private Long id;
        private String name;
        
        @JsonProperty("image_path")
        private String imagePath;
    }
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Season {
        private Long id;
        private String name;
    }
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Stage {
        private Long id;
        private String name;
    }
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class State {
        private Long id;
        private String state;
        private String name;
        
        @JsonProperty("short_name")
        private String shortName;
    }
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Participant {
        private Long id;
        private String name;
        
        @JsonProperty("short_code")
        private String shortCode;
        
        @JsonProperty("image_path")
        private String imagePath;
        
        private Meta meta;
    }
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Meta {
        private String location;
        private Boolean winner;
        private Integer position;
    }
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Score {
        private Long id;
        private String description;

        @JsonProperty("participant_id")
        private Long participantId;

        private ScoreDetail score;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ScoreDetail {
        private Integer goals;
        private String participant;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Prediction {
        private Long id;
        
        @JsonProperty("type_id")
        private Long typeId;
        
        private String predictions;
        
        @JsonProperty("is_won")
        private Boolean isWon;
    }
}
