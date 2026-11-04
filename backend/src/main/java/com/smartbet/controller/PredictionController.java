package com.smartbet.controller;

import com.smartbet.dto.response.ApiResponse;
import com.smartbet.dto.response.PredictionResponse;
import com.smartbet.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/predictions")
@RequiredArgsConstructor
public class PredictionController {

    private final PredictionService predictionService;

    @GetMapping("/free")
    public ResponseEntity<ApiResponse<List<PredictionResponse>>> getFreePredictions() {
        List<PredictionResponse> predictions = predictionService.getFreePredictions();
        return ResponseEntity.ok(ApiResponse.ok("Free predictions fetched successfully", predictions));
    }

    @GetMapping("/vip")
    public ResponseEntity<ApiResponse<List<PredictionResponse>>> getVipPredictions() {
        List<PredictionResponse> predictions = predictionService.getVipPredictions();
        return ResponseEntity.ok(ApiResponse.ok("VIP predictions fetched successfully", predictions));
    }

    @GetMapping("/results")
    public ResponseEntity<ApiResponse<List<PredictionResponse>>> getResults() {
        List<PredictionResponse> results = predictionService.getResults();
        return ResponseEntity.ok(ApiResponse.ok("Results fetched successfully", results));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PredictionResponse>> getPredictionById(@PathVariable Long id) {
        PredictionResponse prediction = predictionService.getPredictionById(id);
        return ResponseEntity.ok(ApiResponse.ok(prediction));
    }
}
