package com.smartbet.service;

import com.smartbet.dto.sportmonks.SportmonksFixture;
import com.smartbet.entity.Category;
import com.smartbet.entity.Prediction;
import com.smartbet.repository.CategoryRepository;
import com.smartbet.repository.PredictionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class PredictionSyncService {

    private final FootballProviderService providerService;
    private final PredictionRepository predictionRepository;
    private final CategoryRepository categoryRepository;
    private final AiAnalysisService aiAnalysisService;
    private final Random random = new Random();

    @Transactional
    public int syncTodayPredictions() {
        List<SportmonksFixture> fixtures = providerService.getTodayFixtures();
        return syncFixtures(fixtures);
    }

    @Transactional
    public int syncTomorrowPredictions() {
        List<SportmonksFixture> fixtures = providerService.getTomorrowFixtures();
        return syncFixtures(fixtures);
    }

    @Transactional
    public int syncAllPredictions() {
        List<SportmonksFixture> fixtures = providerService.getAllUpcomingFixtures();
        return syncFixtures(fixtures);
    }

    @Transactional
    public int syncResults(int days) {
        List<SportmonksFixture> fixtures = providerService.getPastFixtures(days);
        int settled = 0;

        for (SportmonksFixture fixture : fixtures) {
            try {
                String fixtureId = "sportmonks_" + fixture.getId();
                Optional<Prediction> existing = predictionRepository.findByProviderFixtureId(fixtureId);
                if (existing.isEmpty()) {
                    continue;
                }

                Prediction prediction = existing.get();
                if (prediction.getStatus() != Prediction.PredictionStatus.PENDING) {
                    continue;
                }

                if (settlePrediction(prediction, fixture)) {
                    predictionRepository.save(prediction);
                    settled++;
                    log.info("Settled prediction {} vs {} -> {}",
                            prediction.getHomeTeam(), prediction.getAwayTeam(), prediction.getStatus());
                }
            } catch (Exception e) {
                log.error("Error settling fixture {}: {}", fixture.getId(), e.getMessage(), e);
            }
        }

        log.info("Results sync completed. {} predictions settled", settled);
        return settled;
    }

    private boolean settlePrediction(Prediction prediction, SportmonksFixture fixture) {
        if (!isFinished(fixture)) {
            return false;
        }

        int[] score = extractFinalScore(fixture);
        if (score == null) {
            log.warn("Fixture {} finished but no score available", fixture.getId());
            return false;
        }

        boolean won = evaluatePrediction(prediction.getPredictionValue() != null
                ? prediction.getPredictionValue() : prediction.getPrediction(), score[0], score[1]);
        prediction.setStatus(won ? Prediction.PredictionStatus.WON : Prediction.PredictionStatus.LOST);
        return true;
    }

    private boolean isFinished(SportmonksFixture fixture) {
        if (fixture.getState() == null || fixture.getState().getState() == null) {
            return false;
        }
        String state = fixture.getState().getState();
        return "FT".equals(state) || "AET".equals(state) || "FT_PEN".equals(state);
    }

    private int[] extractFinalScore(SportmonksFixture fixture) {
        if (fixture.getScores() == null || fixture.getScores().isEmpty()) {
            return null;
        }

        for (String desc : List.of("CURRENT", "2ND_HALF", "FT")) {
            Integer home = null;
            Integer away = null;
            for (SportmonksFixture.Score s : fixture.getScores()) {
                if (s.getScore() == null || s.getScore().getGoals() == null
                        || s.getScore().getParticipant() == null
                        || !desc.equalsIgnoreCase(s.getDescription())) {
                    continue;
                }
                if ("home".equalsIgnoreCase(s.getScore().getParticipant())) {
                    home = s.getScore().getGoals();
                } else if ("away".equalsIgnoreCase(s.getScore().getParticipant())) {
                    away = s.getScore().getGoals();
                }
            }
            if (home != null && away != null) {
                return new int[]{home, away};
            }
        }
        return null;
    }

    private boolean evaluatePrediction(String predictionValue, int home, int away) {
        if (predictionValue == null) {
            return false;
        }
        String v = predictionValue.toUpperCase().replace('-', ' ').replace('_', ' ').trim();
        int total = home + away;

        if (v.matches("\\d+ \\d+")) {
            String[] parts = v.split(" ");
            return home == Integer.parseInt(parts[0]) && away == Integer.parseInt(parts[1]);
        }
        if (v.contains("BTTS") || v.contains("BOTH TEAMS TO SCORE")) {
            boolean both = home > 0 && away > 0;
            return v.contains("NO") ? !both : both;
        }
        if (v.contains("OVER") || v.contains("UNDER")) {
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("(\\d+(\\.\\d+)?)").matcher(v);
            if (!m.find()) {
                return false;
            }
            double line = Double.parseDouble(m.group(1));
            return v.contains("OVER") ? total > line : total < line;
        }
        if (v.contains("HOME") && v.contains("AWAY")) {
            return home != away; // Home Win or Away Win (12)
        }
        if ((v.contains("HOME") && v.contains("DRAW")) || v.equals("1X")) {
            return home >= away;
        }
        if ((v.contains("AWAY") && v.contains("DRAW")) || v.equals("X2")) {
            return away >= home;
        }
        if (v.contains("DRAW") || v.equals("X")) {
            return home == away;
        }
        if (v.contains("HOME")) {
            return home > away;
        }
        if (v.contains("AWAY")) {
            return away > home;
        }
        return false;
    }

    private int syncFixtures(List<SportmonksFixture> fixtures) {
        int synced = 0;
        int updated = 0;

        for (SportmonksFixture fixture : fixtures) {
            try {
                String fixtureId = "sportmonks_" + fixture.getId();

                // Check if already exists
                Optional<Prediction> existing = predictionRepository.findByProviderFixtureId(fixtureId);
                
                if (existing.isPresent()) {
                    // Update existing prediction
                    Prediction prediction = existing.get();
                    updatePredictionFromFixture(prediction, fixture);
                    predictionRepository.save(prediction);
                    updated++;
                    log.debug("Updated prediction: {} vs {}", prediction.getHomeTeam(), prediction.getAwayTeam());
                } else {
                    // Create new prediction
                    Prediction prediction = mapFixtureToPrediction(fixture, fixtureId);
                    predictionRepository.save(prediction);
                    synced++;
                    log.info("Synced new prediction: {} vs {}", prediction.getHomeTeam(), prediction.getAwayTeam());
                }
            } catch (Exception e) {
                log.error("Error syncing fixture {}: {}", fixture.getId(), e.getMessage(), e);
            }
        }

        log.info("Sync completed. {} new predictions added, {} updated", synced, updated);
        return synced;
    }

    private Prediction mapFixtureToPrediction(SportmonksFixture fixture, String fixtureId) {
        // Parse match time
        LocalDateTime matchTime = parseMatchTime(fixture.getStartingAt());

        // Extract teams
        String homeTeam = "Unknown";
        String awayTeam = "Unknown";
        if (fixture.getParticipants() != null && fixture.getParticipants().size() >= 2) {
            for (SportmonksFixture.Participant p : fixture.getParticipants()) {
                if ("home".equalsIgnoreCase(p.getMeta().getLocation())) {
                    homeTeam = p.getName();
                } else if ("away".equalsIgnoreCase(p.getMeta().getLocation())) {
                    awayTeam = p.getName();
                }
            }
        }

        // Try to extract prediction from Sportmonks data
        String predictionType = null;
        String predictionValue = null;
        int confidence = 75; // Default confidence
        double odds = 1.85; // Default odds
        boolean usedSportmonksData = false;
        
        if (fixture.getPredictions() != null && !fixture.getPredictions().isEmpty()) {
            // Use first prediction from Sportmonks
            SportmonksFixture.Prediction sportmonksPred = fixture.getPredictions().get(0);
            
            if (sportmonksPred.getPredictions() != null) {
                // Parse Sportmonks prediction string (e.g., "HOME_WIN", "OVER_2_5", etc.)
                predictionValue = sportmonksPred.getPredictions();
                predictionType = extractPredictionType(predictionValue);
                
                // Use Sportmonks confidence if available (isWon can indicate confidence)
                // For now, use higher confidence for Sportmonks predictions
                confidence = 85 + random.nextInt(11); // 85-95
                usedSportmonksData = true;
                
                log.debug("Using Sportmonks prediction for {}: {} (type: {})", 
                        homeTeam + " vs " + awayTeam, predictionValue, predictionType);
            }
        }
        
        // Fallback to generated predictions if Sportmonks doesn't provide
        if (predictionType == null || predictionValue == null) {
            predictionType = generatePredictionType();
            predictionValue = generatePredictionValue(predictionType);
            confidence = generateConfidence();
            
            log.debug("Generated prediction for {} (no Sportmonks data): {} (type: {})", 
                    homeTeam + " vs " + awayTeam, predictionValue, predictionType);
        }
        
        // Generate realistic odds based on prediction type
        odds = generateOdds(predictionType);
        
        // Determine category based on confidence
        // IF confidence >= 90 THEN VIP
        // IF confidence between 80 and 89 THEN FREE
        // ELSE FREE (lower confidence)
        boolean isVip = confidence >= 90;
        String categoryType = isVip ? "VIP" : "FREE";
        
        // Get appropriate category
        List<Category> categories = categoryRepository.findAll();
        Category category = categories.stream()
                .filter(c -> categoryType.equals(c.getType().name()))
                .findFirst()
                .orElse(categories.get(0));

        String prediction = predictionValue; // For backward compatibility

        return Prediction.builder()
                .homeTeam(homeTeam)
                .awayTeam(awayTeam)
                .league(fixture.getLeague() != null ? fixture.getLeague().getName() : "Unknown League")
                .country(fixture.getLeague() != null && fixture.getLeague().getCountry() != null 
                        ? fixture.getLeague().getCountry().getName() : "Unknown")
                .matchTime(matchTime)
                .prediction(prediction)
                .predictionType(predictionType)
                .predictionValue(predictionValue)
                .odds(odds)
                .confidence(confidence)
                .category(category)
                .isVip(isVip)
                .status(Prediction.PredictionStatus.REVIEW)
                .analysis(aiAnalysisService.generateAnalysis(fixture, homeTeam, awayTeam, predictionValue, confidence))
                .providerFixtureId(fixtureId)
                .build();
    }

    private String extractPredictionType(String sportmonksPrediction) {
        if (sportmonksPrediction == null) return "MATCH_RESULT";
        
        String upper = sportmonksPrediction.toUpperCase();
        if (upper.contains("OVER") || upper.contains("UNDER")) {
            return "OVER_UNDER";
        } else if (upper.contains("BTTS") || upper.contains("BOTH")) {
            return "BOTH_TEAMS_SCORE";
        } else if (upper.contains("DOUBLE")) {
            return "DOUBLE_CHANCE";
        } else if (upper.matches("\\d+-\\d+")) {
            return "CORRECT_SCORE";
        } else {
            return "MATCH_RESULT";
        }
    }

    private void updatePredictionFromFixture(Prediction prediction, SportmonksFixture fixture) {
        // Update match time if changed
        LocalDateTime matchTime = parseMatchTime(fixture.getStartingAt());
        prediction.setMatchTime(matchTime);
        
        // Settle the prediction if the match is finished
        if (prediction.getStatus() == Prediction.PredictionStatus.PENDING) {
            settlePrediction(prediction, fixture);
        }
    }

    private LocalDateTime parseMatchTime(String startingAt) {
        try {
            return LocalDateTime.parse(startingAt, DateTimeFormatter.ISO_DATE_TIME);
        } catch (Exception e) {
            log.warn("Failed to parse match time: {}", startingAt);
            return LocalDateTime.now().plusDays(1);
        }
    }

    private String generatePredictionType() {
        String[] types = {
                "MATCH_RESULT",
                "OVER_UNDER",
                "BOTH_TEAMS_SCORE",
                "DOUBLE_CHANCE",
                "CORRECT_SCORE"
        };
        return types[random.nextInt(types.length)];
    }

    private String generatePredictionValue(String type) {
        return switch (type) {
            case "MATCH_RESULT" -> {
                String[] values = {"Home Win", "Away Win", "Draw"};
                yield values[random.nextInt(values.length)];
            }
            case "OVER_UNDER" -> {
                String[] values = {"Over 2.5 Goals", "Under 2.5 Goals", "Over 1.5 Goals", "Under 3.5 Goals"};
                yield values[random.nextInt(values.length)];
            }
            case "BOTH_TEAMS_SCORE" -> {
                String[] values = {"Both Teams to Score - Yes", "Both Teams to Score - No"};
                yield values[random.nextInt(values.length)];
            }
            case "DOUBLE_CHANCE" -> {
                String[] values = {"Home Win or Draw", "Away Win or Draw", "Home Win or Away Win"};
                yield values[random.nextInt(values.length)];
            }
            case "CORRECT_SCORE" -> {
                String[] values = {"1-0", "2-0", "2-1", "1-1", "0-0", "3-1"};
                yield values[random.nextInt(values.length)];
            }
            default -> "Home Win";
        };
    }

    private double generateOdds(String predictionType) {
        // Generate realistic odds based on prediction type
        return switch (predictionType) {
            case "MATCH_RESULT" -> 1.5 + (random.nextDouble() * 2.5); // 1.5 - 4.0
            case "OVER_UNDER" -> 1.6 + (random.nextDouble() * 0.9); // 1.6 - 2.5
            case "BOTH_TEAMS_SCORE" -> 1.7 + (random.nextDouble() * 0.8); // 1.7 - 2.5
            case "DOUBLE_CHANCE" -> 1.3 + (random.nextDouble() * 0.7); // 1.3 - 2.0
            case "CORRECT_SCORE" -> 6.0 + (random.nextDouble() * 9.0); // 6.0 - 15.0
            default -> 1.8 + (random.nextDouble() * 1.2); // 1.8 - 3.0
        };
    }

    private int generateConfidence() {
        // Generate confidence between 65-95
        // Higher chance for 80-89 range (FREE)
        // Lower chance for 90+ (VIP)
        int base = random.nextInt(100);
        if (base < 70) {
            // 70% chance: 80-89 (FREE)
            return 80 + random.nextInt(10);
        } else if (base < 90) {
            // 20% chance: 65-79 (FREE, lower confidence)
            return 65 + random.nextInt(15);
        } else {
            // 10% chance: 90-95 (VIP)
            return 90 + random.nextInt(6);
        }
    }

}
