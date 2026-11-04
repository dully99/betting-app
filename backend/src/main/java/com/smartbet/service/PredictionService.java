package com.smartbet.service;

import com.smartbet.dto.request.PredictionRequest;
import com.smartbet.dto.response.PredictionResponse;
import com.smartbet.entity.Category;
import com.smartbet.entity.Prediction;
import com.smartbet.entity.Prediction.PredictionStatus;
import com.smartbet.repository.CategoryRepository;
import com.smartbet.repository.PredictionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PredictionService {

    private final PredictionRepository predictionRepository;
    private final CategoryRepository categoryRepository;

    public List<PredictionResponse> getFreePredictions() {
        return predictionRepository.findByIsVipFalseAndStatusOrderByMatchTimeAsc(PredictionStatus.PENDING)
                .stream()
                .map(PredictionResponse::from)
                .collect(Collectors.toList());
    }

    public List<PredictionResponse> getVipPredictions() {
        return predictionRepository.findByIsVipTrueAndStatusOrderByMatchTimeAsc(PredictionStatus.PENDING)
                .stream()
                .map(PredictionResponse::from)
                .collect(Collectors.toList());
    }

    public List<PredictionResponse> getResults() {
        return predictionRepository.findByStatusInOrderByMatchTimeDesc(
                        List.of(PredictionStatus.WON, PredictionStatus.LOST))
                .stream()
                .map(PredictionResponse::from)
                .collect(Collectors.toList());
    }

    public List<PredictionResponse> getReviewQueue() {
        return predictionRepository.findByStatusInOrderByMatchTimeDesc(
                        List.of(PredictionStatus.REVIEW))
                .stream()
                .map(PredictionResponse::from)
                .collect(Collectors.toList());
    }

    public PredictionResponse approve(Long id) {
        Prediction prediction = predictionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prediction not found with id: " + id));
        prediction.setStatus(PredictionStatus.PENDING);
        return PredictionResponse.from(predictionRepository.save(prediction));
    }

    public PredictionResponse reject(Long id) {
        Prediction prediction = predictionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prediction not found with id: " + id));
        prediction.setStatus(PredictionStatus.REJECTED);
        return PredictionResponse.from(predictionRepository.save(prediction));
    }

    public List<PredictionResponse> getPredictions(PredictionStatus status) {
        List<Prediction> predictions = status == null
                ? predictionRepository.findAll()
                : predictionRepository.findByStatusInOrderByMatchTimeDesc(List.of(status));
        return predictions.stream().map(PredictionResponse::from).collect(Collectors.toList());
    }

    public java.util.Map<String, Long> getStats() {
        List<Prediction> all = predictionRepository.findAll();
        java.util.Map<String, Long> stats = new java.util.HashMap<>();
        stats.put("total", (long) all.size());
        stats.put("review", all.stream().filter(p -> p.getStatus() == PredictionStatus.REVIEW).count());
        stats.put("published", all.stream().filter(p -> p.getStatus() == PredictionStatus.PENDING).count());
        stats.put("won", all.stream().filter(p -> p.getStatus() == PredictionStatus.WON).count());
        stats.put("lost", all.stream().filter(p -> p.getStatus() == PredictionStatus.LOST).count());
        stats.put("rejected", all.stream().filter(p -> p.getStatus() == PredictionStatus.REJECTED).count());
        stats.put("vip", all.stream().filter(p -> Boolean.TRUE.equals(p.getIsVip())).count());
        long settled = stats.get("won") + stats.get("lost");
        stats.put("winRate", settled == 0 ? 0 : Math.round(100.0 * stats.get("won") / settled));
        return stats;
    }

    public PredictionResponse updateAnalysis(Long id, String analysis) {
        Prediction prediction = predictionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prediction not found with id: " + id));
        prediction.setAnalysis(analysis);
        return PredictionResponse.from(predictionRepository.save(prediction));
    }

    public PredictionResponse getPredictionById(Long id) {
        Prediction prediction = predictionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prediction not found with id: " + id));
        return PredictionResponse.from(prediction);
    }

    public PredictionResponse createPrediction(PredictionRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        Prediction prediction = Prediction.builder()
                .homeTeam(request.getHomeTeam())
                .awayTeam(request.getAwayTeam())
                .league(request.getLeague())
                .country(request.getCountry())
                .matchTime(request.getMatchTime())
                .prediction(request.getPrediction())
                .odds(request.getOdds())
                .confidence(request.getConfidence())
                .category(category)
                .isVip(request.getIsVip())
                .status(request.getStatus() != null
                        ? PredictionStatus.valueOf(request.getStatus())
                        : PredictionStatus.PENDING)
                .analysis(request.getAnalysis())
                .providerFixtureId(request.getProviderFixtureId())
                .build();

        return PredictionResponse.from(predictionRepository.save(prediction));
    }

    public PredictionResponse updatePrediction(Long id, PredictionRequest request) {
        Prediction prediction = predictionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prediction not found with id: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        prediction.setHomeTeam(request.getHomeTeam());
        prediction.setAwayTeam(request.getAwayTeam());
        prediction.setLeague(request.getLeague());
        prediction.setCountry(request.getCountry());
        prediction.setMatchTime(request.getMatchTime());
        prediction.setPrediction(request.getPrediction());
        prediction.setOdds(request.getOdds());
        prediction.setConfidence(request.getConfidence());
        prediction.setCategory(category);
        prediction.setIsVip(request.getIsVip());
        prediction.setAnalysis(request.getAnalysis());
        if (request.getStatus() != null) {
            prediction.setStatus(PredictionStatus.valueOf(request.getStatus()));
        }

        return PredictionResponse.from(predictionRepository.save(prediction));
    }

    public void deletePrediction(Long id) {
        if (!predictionRepository.existsById(id)) {
            throw new RuntimeException("Prediction not found with id: " + id);
        }
        predictionRepository.deleteById(id);
    }
}
