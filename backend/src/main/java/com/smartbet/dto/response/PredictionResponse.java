package com.smartbet.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.smartbet.entity.Prediction;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PredictionResponse {

    private Long id;
    private String homeTeam;
    private String awayTeam;
    private String league;
    private String country;
    private LocalDateTime matchTime;
    private String prediction;
    private String predictionType;
    private String predictionValue;
    private Double odds;
    private Integer confidence;
    private String category;
    private String categoryType;
    private Boolean isVip;
    private String status;
    private String analysis;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PredictionResponse from(Prediction p) {
        return PredictionResponse.builder()
                .id(p.getId())
                .homeTeam(p.getHomeTeam())
                .awayTeam(p.getAwayTeam())
                .league(p.getLeague())
                .country(p.getCountry())
                .matchTime(p.getMatchTime())
                .prediction(p.getPrediction())
                .predictionType(p.getPredictionType())
                .predictionValue(p.getPredictionValue())
                .odds(p.getOdds())
                .confidence(p.getConfidence())
                .category(p.getCategory().getName())
                .categoryType(p.getCategory().getType().name())
                .isVip(p.getIsVip())
                .status(p.getStatus().name())
                .analysis(p.getAnalysis())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
