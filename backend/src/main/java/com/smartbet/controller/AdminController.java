package com.smartbet.controller;

import com.smartbet.dto.request.PredictionRequest;
import com.smartbet.dto.response.ApiResponse;
import com.smartbet.dto.response.PredictionResponse;
import com.smartbet.dto.response.FixtureResponse;
import com.smartbet.service.AiAnalysisService;
import com.smartbet.service.FootballProviderService;
import com.smartbet.service.OddsService;
import com.smartbet.service.PredictionService;
import com.smartbet.service.PredictionSyncService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final PredictionService predictionService;
    private final PredictionSyncService syncService;
    private final AiAnalysisService aiAnalysisService;
    private final FootballProviderService providerService;
    private final OddsService oddsService;

    @GetMapping("/odds")
    public ResponseEntity<ApiResponse<java.util.Map<String, java.util.Map<String, Double>>>> getOdds(
            @RequestParam String homeTeam, @RequestParam String awayTeam) {
        java.util.Map<String, java.util.Map<String, Double>> odds =
                oddsService.getOddsForFixture(homeTeam, awayTeam);
        return ResponseEntity.ok(ApiResponse.ok(
                odds != null ? "Odds fetched" : "No odds available (check ODDS_API_KEY)", odds));
    }

    @GetMapping("/fixtures")
    public ResponseEntity<ApiResponse<java.util.List<FixtureResponse>>> getUpcomingFixtures(
            @RequestParam(defaultValue = "1") int days) {
        java.util.List<FixtureResponse> fixtures = providerService
                .getFixturesBetween(java.time.LocalDate.now(), java.time.LocalDate.now().plusDays(days))
                .stream()
                .map(FixtureResponse::from)
                .toList();
        return ResponseEntity.ok(ApiResponse.ok("Fixtures fetched successfully", fixtures));
    }

    @GetMapping("/predictions")
    public ResponseEntity<ApiResponse<java.util.List<PredictionResponse>>> getPredictions(
            @RequestParam(required = false) String status) {
        com.smartbet.entity.Prediction.PredictionStatus s = status == null ? null
                : com.smartbet.entity.Prediction.PredictionStatus.valueOf(status.toUpperCase());
        return ResponseEntity.ok(ApiResponse.ok("Predictions fetched successfully",
                predictionService.getPredictions(s)));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<java.util.Map<String, Long>>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok("Stats fetched successfully",
                predictionService.getStats()));
    }

    @GetMapping("/predictions/review")
    public ResponseEntity<ApiResponse<java.util.List<PredictionResponse>>> getReviewQueue() {
        return ResponseEntity.ok(ApiResponse.ok("Review queue fetched successfully",
                predictionService.getReviewQueue()));
    }

    @PostMapping("/predictions/{id}/approve")
    public ResponseEntity<ApiResponse<PredictionResponse>> approvePrediction(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Prediction approved",
                predictionService.approve(id)));
    }

    @PostMapping("/predictions/{id}/reject")
    public ResponseEntity<ApiResponse<PredictionResponse>> rejectPrediction(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Prediction rejected",
                predictionService.reject(id)));
    }

    @PostMapping("/predictions/{id}/regenerate-analysis")
    public ResponseEntity<ApiResponse<PredictionResponse>> regenerateAnalysis(@PathVariable Long id) {
        PredictionResponse p = predictionService.getPredictionById(id);
        String analysis = aiAnalysisService.generateAnalysis(
                p.getHomeTeam(), p.getAwayTeam(), p.getLeague(),
                p.getMatchTime() != null ? p.getMatchTime().toString() : "",
                p.getPrediction(), p.getConfidence() != null ? p.getConfidence() : 75);
        return ResponseEntity.ok(ApiResponse.ok("Analysis regenerated",
                predictionService.updateAnalysis(id, analysis)));
    }

    @PostMapping("/predictions")
    public ResponseEntity<ApiResponse<PredictionResponse>> createPrediction(
            @Valid @RequestBody PredictionRequest request) {
        PredictionResponse response = predictionService.createPrediction(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Prediction created successfully", response));
    }

    @PutMapping("/predictions/{id}")
    public ResponseEntity<ApiResponse<PredictionResponse>> updatePrediction(
            @PathVariable Long id,
            @Valid @RequestBody PredictionRequest request) {
        PredictionResponse response = predictionService.updatePrediction(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Prediction updated successfully", response));
    }

    @DeleteMapping("/predictions/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePrediction(@PathVariable Long id) {
        predictionService.deletePrediction(id);
        return ResponseEntity.ok(ApiResponse.ok("Prediction deleted successfully", null));
    }

    @PostMapping("/sync/today")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> syncTodayPredictions() {
        int count = syncService.syncTodayPredictions();
        return ResponseEntity.ok(ApiResponse.ok(
                "Today's predictions synced successfully",
                Map.of("synced", count)
        ));
    }

    @PostMapping("/sync/tomorrow")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> syncTomorrowPredictions() {
        int count = syncService.syncTomorrowPredictions();
        return ResponseEntity.ok(ApiResponse.ok(
                "Tomorrow's predictions synced successfully",
                Map.of("synced", count)
        ));
    }

    @PostMapping("/sync/all")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> syncAllPredictions() {
        int count = syncService.syncAllPredictions();
        return ResponseEntity.ok(ApiResponse.ok(
                "All upcoming predictions synced successfully",
                Map.of("synced", count)
        ));
    }

    @PostMapping("/sync/results")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> syncResults(
            @RequestParam(defaultValue = "3") int days) {
        int count = syncService.syncResults(days);
        return ResponseEntity.ok(ApiResponse.ok(
                "Results synced successfully",
                Map.of("settled", count)
        ));
    }
}
