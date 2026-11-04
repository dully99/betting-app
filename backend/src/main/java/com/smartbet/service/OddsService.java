package com.smartbet.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.smartbet.config.OddsApiConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Fetches real bookmaker odds from the-odds-api.com.
 * Caches per-sport responses in memory for 1 hour to conserve the free quota.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OddsService {

    private static final List<String> SOCCER_SPORTS = List.of(
            "soccer_epl",
            "soccer_england_championship",
            "soccer_uefa_champs_league",
            "soccer_uefa_europa_league",
            "soccer_spain_la_liga",
            "soccer_italy_serie_a",
            "soccer_germany_bundesliga",
            "soccer_france_ligue_one",
            "soccer_netherlands_eredivisie",
            "soccer_portugal_primeira_liga",
            "soccer_turkey_super_league",
            "soccer_brazil_campeonato"
    );

    private static final long CACHE_TTL_SECONDS = 3600;

    private final OddsApiConfig config;
    private final RestTemplate restTemplate = new RestTemplate();
    private final Map<String, CachedEvents> cache = new HashMap<>();

    private record CachedEvents(List<JsonNode> events, Instant fetchedAt) {}

    public boolean isConfigured() {
        return config.getApiKey() != null && !config.getApiKey().isBlank();
    }

    /**
     * Finds bookmaker odds for a fixture, fuzzy-matched on team names.
     * Returns a map of market -> outcome -> price, e.g. {h2h: {home: 1.5, draw: 4.2, away: 6.0}}.
     */
    public Map<String, Map<String, Double>> getOddsForFixture(String homeTeam, String awayTeam) {
        if (!isConfigured()) {
            return null;
        }

        for (String sport : SOCCER_SPORTS) {
            for (JsonNode event : getEvents(sport)) {
                if (teamsMatch(event.path("home_team").asText(""), homeTeam)
                        && teamsMatch(event.path("away_team").asText(""), awayTeam)) {
                    return extractMarkets(event);
                }
            }
        }
        return null;
    }

    private List<JsonNode> getEvents(String sport) {
        CachedEvents cached = cache.get(sport);
        if (cached != null && cached.fetchedAt().plusSeconds(CACHE_TTL_SECONDS).isAfter(Instant.now())) {
            return cached.events();
        }
        try {
            String url = String.format("%s/sports/%s/odds?apiKey=%s&regions=%s&markets=h2h,totals,btts&oddsFormat=decimal",
                    config.getBaseUrl(), sport, config.getApiKey(), config.getRegions());
            ResponseEntity<JsonNode> response = restTemplate.getForEntity(url, JsonNode.class);
            List<JsonNode> events = new ArrayList<>();
            if (response.getBody() != null && response.getBody().isArray()) {
                response.getBody().forEach(events::add);
            }
            cache.put(sport, new CachedEvents(events, Instant.now()));
            return events;
        } catch (Exception e) {
            log.warn("Failed to fetch odds for {}: {}", sport, e.getMessage());
            return List.of();
        }
    }

    private boolean teamsMatch(String a, String b) {
        String na = normalize(a);
        String nb = normalize(b);
        return na.equals(nb) || na.contains(nb) || nb.contains(na);
    }

    private String normalize(String s) {
        return s.toLowerCase()
                .replaceAll("\\b(fc|cf|sc|sk|fk|ac|as|ssc|afc|ud|cd|rc|fk|sv|vfb|vfl|tsg|fc\\.?|the)\\b", "")
                .replaceAll("[^a-z0-9]", "");
    }

    private Map<String, Map<String, Double>> extractMarkets(JsonNode event) {
        Map<String, Map<String, Double>> result = new HashMap<>();
        JsonNode bookmakers = event.path("bookmakers");
        if (!bookmakers.isArray() || bookmakers.isEmpty()) {
            return result;
        }

        for (JsonNode market : bookmakers.get(0).path("markets")) {
            String key = market.path("key").asText();
            Map<String, Double> prices = new HashMap<>();
            for (JsonNode outcome : market.path("outcomes")) {
                String name = outcome.path("name").asText().toLowerCase();
                double price = outcome.path("price").asDouble();
                if ("h2h".equals(key)) {
                    String homeTeam = event.path("home_team").asText().toLowerCase();
                    String awayTeam = event.path("away_team").asText().toLowerCase();
                    if (name.equals("draw")) prices.put("draw", price);
                    else if (name.contains(awayTeam) || awayTeam.contains(name)) prices.put("away", price);
                    else if (name.contains(homeTeam) || homeTeam.contains(name)) prices.put("home", price);
                } else if ("totals".equals(key)) {
                    double point = outcome.path("point").asDouble();
                    String out = outcome.path("name").asText().toLowerCase();
                    prices.put(out + point, price);
                } else if ("btts".equals(key)) {
                    prices.put(name, price);
                }
            }
            result.put(key, prices);
        }
        return result;
    }
}
