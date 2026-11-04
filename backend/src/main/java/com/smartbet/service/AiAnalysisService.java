package com.smartbet.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.smartbet.config.AiConfig;
import com.smartbet.dto.sportmonks.SportmonksFixture;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiAnalysisService {

    private final AiConfig config;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Generates a human-readable match analysis for a pick using an LLM.
     * Falls back to a templated analysis when the AI provider is not configured
     * or the call fails.
     */
    public String generateAnalysis(String homeTeam, String awayTeam, String league,
                                   String kickoff, String predictionValue, int confidence) {
        SportmonksFixture fixture = new SportmonksFixture();
        SportmonksFixture.League l = new SportmonksFixture.League();
        l.setName(league);
        fixture.setLeague(l);
        fixture.setStartingAt(kickoff);
        return generateAnalysis(fixture, homeTeam, awayTeam, predictionValue, confidence);
    }

    public String generateAnalysis(SportmonksFixture fixture, String homeTeam, String awayTeam,
                                   String predictionValue, int confidence) {
        if (config.isEnabled() && config.getApiKey() != null && !config.getApiKey().isBlank()) {
            try {
                String analysis = callLlm(fixture, homeTeam, awayTeam, predictionValue, confidence);
                if (analysis != null && !analysis.isBlank()) {
                    return analysis.trim();
                }
            } catch (Exception e) {
                log.warn("AI analysis failed, using fallback: {}", e.getMessage());
            }
        }
        return fallbackAnalysis(homeTeam, awayTeam, predictionValue, confidence);
    }

    private String callLlm(SportmonksFixture fixture, String homeTeam, String awayTeam,
                           String predictionValue, int confidence) {
        String league = fixture.getLeague() != null ? fixture.getLeague().getName() : "unknown league";

        String prompt = String.format(
                "You are a professional football betting analyst. Write a concise 2-3 sentence analysis " +
                "for this pick. Do not mention odds or guarantees. Fixture: %s vs %s, league: %s, " +
                "kickoff: %s. Pick: %s. Model confidence: %d%%.",
                homeTeam, awayTeam, league, fixture.getStartingAt(), predictionValue, confidence);

        ObjectNode body = objectMapper.createObjectNode();
        body.put("model", config.getModel());
        body.put("max_tokens", 200);
        ArrayNode messages = body.putArray("messages");
        ObjectNode msg = messages.addObject();
        msg.put("role", "user");
        msg.put("content", prompt);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key", config.getApiKey());
        headers.set("anthropic-version", "2023-06-01");

        ResponseEntity<JsonNode> response = restTemplate.postForEntity(
                config.getBaseUrl(), new HttpEntity<>(body.toString(), headers), JsonNode.class);

        JsonNode content = response.getBody() != null ? response.getBody().path("content") : null;
        if (content != null && content.isArray() && !content.isEmpty()) {
            return content.get(0).path("text").asText(null);
        }
        return null;
    }

    private String fallbackAnalysis(String homeTeam, String awayTeam, String predictionValue, int confidence) {
        return String.format(
                "%s vs %s. Statistical model suggests %s with %d%% confidence based on recent form, " +
                "head-to-head records, and provider prediction data.",
                homeTeam, awayTeam, predictionValue, confidence);
    }
}
