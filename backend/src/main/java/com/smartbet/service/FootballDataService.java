package com.smartbet.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.smartbet.config.FootballDataConfig;
import com.smartbet.dto.sportmonks.SportmonksFixture;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Adapter for football-data.org API v4. Maps its /matches response onto the
 * internal SportmonksFixture model so the rest of the pipeline is unchanged.
 * Note: football-data.org does not provide predictions.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FootballDataService {

    private final FootballDataConfig config;
    private final RestTemplate restTemplate = new RestTemplate();

    public List<SportmonksFixture> getFixturesByDate(LocalDate date) {
        return getFixturesBetween(date, date);
    }

    public List<SportmonksFixture> getFixturesBetween(LocalDate start, LocalDate end) {
        try {
            String url = String.format("%s/matches?dateFrom=%s&dateTo=%s",
                    config.getBaseUrl(),
                    start.format(DateTimeFormatter.ISO_LOCAL_DATE),
                    end.format(DateTimeFormatter.ISO_LOCAL_DATE));

            log.info("Fetching matches from football-data.org: {}", url);

            HttpHeaders headers = new HttpHeaders();
            headers.set("X-Auth-Token", config.getApiToken());
            headers.set("Accept", "application/json");

            ResponseEntity<JsonNode> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(headers), JsonNode.class);

            JsonNode matches = response.getBody() != null ? response.getBody().path("matches") : null;
            if (matches == null || !matches.isArray()) {
                log.warn("Empty response from football-data.org for {} - {}", start, end);
                return Collections.emptyList();
            }

            List<SportmonksFixture> fixtures = new ArrayList<>();
            for (JsonNode m : matches) {
                fixtures.add(mapMatch(m));
            }
            log.info("Fetched {} matches between {} and {} from football-data.org", fixtures.size(), start, end);
            return fixtures;
        } catch (Exception e) {
            log.error("Error fetching matches from football-data.org for {} - {}: {}", start, end, e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    public List<SportmonksFixture> getTodayFixtures() {
        return getFixturesByDate(LocalDate.now());
    }

    public List<SportmonksFixture> getTomorrowFixtures() {
        return getFixturesByDate(LocalDate.now().plusDays(1));
    }

    public List<SportmonksFixture> getAllUpcomingFixtures() {
        List<SportmonksFixture> all = new ArrayList<>();
        all.addAll(getTodayFixtures());
        all.addAll(getTomorrowFixtures());
        return all;
    }

    public List<SportmonksFixture> getPastFixtures(int days) {
        return getFixturesBetween(LocalDate.now().minusDays(days), LocalDate.now());
    }

    private SportmonksFixture mapMatch(JsonNode m) {
        SportmonksFixture f = new SportmonksFixture();
        f.setId(m.path("id").asLong());
        f.setStartingAt(m.path("utcDate").asText(null));

        SportmonksFixture.League league = new SportmonksFixture.League();
        league.setName(m.path("competition").path("name").asText("Unknown"));
        SportmonksFixture.Country country = new SportmonksFixture.Country();
        country.setName(m.path("area").path("name").asText("Unknown"));
        league.setCountry(country);
        f.setLeague(league);

        SportmonksFixture.State state = new SportmonksFixture.State();
        state.setState(mapStatus(m.path("status").asText("")));
        f.setState(state);

        List<SportmonksFixture.Participant> participants = new ArrayList<>();
        participants.add(participant(m.path("homeTeam").path("id").asLong(),
                m.path("homeTeam").path("name").asText("Unknown"), "home"));
        participants.add(participant(m.path("awayTeam").path("id").asLong(),
                m.path("awayTeam").path("name").asText("Unknown"), "away"));
        f.setParticipants(participants);

        JsonNode ft = m.path("score").path("fullTime");
        if (ft.hasNonNull("home") && ft.hasNonNull("away")) {
            List<SportmonksFixture.Score> scores = new ArrayList<>();
            scores.add(score("home", ft.path("home").asInt()));
            scores.add(score("away", ft.path("away").asInt()));
            f.setScores(scores);
        }
        return f;
    }

    private SportmonksFixture.Participant participant(Long id, String name, String location) {
        SportmonksFixture.Participant p = new SportmonksFixture.Participant();
        p.setId(id);
        p.setName(name);
        SportmonksFixture.Meta meta = new SportmonksFixture.Meta();
        meta.setLocation(location);
        p.setMeta(meta);
        return p;
    }

    private SportmonksFixture.Score score(String side, int goals) {
        SportmonksFixture.Score s = new SportmonksFixture.Score();
        s.setDescription("CURRENT");
        SportmonksFixture.ScoreDetail d = new SportmonksFixture.ScoreDetail();
        d.setGoals(goals);
        d.setParticipant(side);
        s.setScore(d);
        return s;
    }

    private String mapStatus(String status) {
        return switch (status) {
            case "FINISHED" -> "FT";
            case "IN_PLAY", "PAUSED", "LIVE" -> "LIVE";
            case "POSTPONED" -> "POSTP";
            case "CANCELLED" -> "CANC";
            case "SUSPENDED" -> "SUSP";
            default -> "NS";
        };
    }

}
