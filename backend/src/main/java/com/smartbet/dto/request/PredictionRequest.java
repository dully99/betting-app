package com.smartbet.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PredictionRequest {

    @NotBlank(message = "Home team is required")
    private String homeTeam;

    @NotBlank(message = "Away team is required")
    private String awayTeam;

    @NotBlank(message = "League is required")
    private String league;

    @NotBlank(message = "Country is required")
    private String country;

    @NotNull(message = "Match time is required")
    private LocalDateTime matchTime;

    @NotBlank(message = "Prediction is required")
    private String prediction;

    @NotNull(message = "Odds are required")
    @DecimalMin(value = "1.0", message = "Odds must be at least 1.0")
    private Double odds;

    @NotNull(message = "Confidence is required")
    @Min(value = 1, message = "Confidence must be between 1 and 100")
    @Max(value = 100, message = "Confidence must be between 1 and 100")
    private Integer confidence;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "isVip flag is required")
    private Boolean isVip;

    private String analysis;

    private String status;

    private String providerFixtureId;
}
