package com.smartbet.service;

import com.smartbet.config.SportmonksConfig;
import com.smartbet.dto.sportmonks.SportmonksFixture;
import com.smartbet.dto.sportmonks.SportmonksResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FootballProviderService {

    private final SportmonksConfig config;
    private final FootballDataService footballDataService;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${football.provider:sportmonks}")
    private String provider;

    private boolean useFootballData() {
        return "footballdata".equalsIgnoreCase(provider);
    }

    public List<SportmonksFixture> getFixturesByDate(LocalDate date) {
        if (useFootballData()) {
            return footballDataService.getFixturesByDate(date);
        }
        try {
            String dateStr = date.format(DateTimeFormatter.ISO_LOCAL_DATE);
            String url = String.format("%s/fixtures/date/%s?api_token=%s&include=participants;league;predictions;scores",
                    config.getBaseUrl(), dateStr, config.getApiToken());

            log.info("Fetching fixtures from Sportmonks: {}", url.replace(config.getApiToken(), "***TOKEN***"));

            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<SportmonksResponse<SportmonksFixture>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<SportmonksResponse<SportmonksFixture>>() {}
            );

            if (response.getBody() != null && response.getBody().getData() != null) {
                List<SportmonksFixture> fixtures = response.getBody().getData();
                log.info("Fetched {} fixtures for date {} from Sportmonks", fixtures.size(), dateStr);
                
                // Log sample fixture data for debugging
                if (!fixtures.isEmpty()) {
                    SportmonksFixture sample = fixtures.get(0);
                    log.debug("Sample fixture: ID={}, Teams={} vs {}, Predictions={}", 
                            sample.getId(),
                            sample.getParticipants() != null ? sample.getParticipants().size() : 0,
                            "participants",
                            sample.getPredictions() != null ? sample.getPredictions().size() : 0);
                }
                
                return fixtures;
            }

            log.warn("Empty response from Sportmonks for date {}", dateStr);
            return Collections.emptyList();
        } catch (Exception e) {
            log.error("Error fetching fixtures from Sportmonks for date {}: {}", date, e.getMessage(), e);
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
        List<SportmonksFixture> allFixtures = new java.util.ArrayList<>();
        allFixtures.addAll(getTodayFixtures());
        allFixtures.addAll(getTomorrowFixtures());
        return allFixtures;
    }

    public List<SportmonksFixture> getFixturesBetween(LocalDate start, LocalDate end) {
        if (useFootballData()) {
            return footballDataService.getFixturesBetween(start, end);
        }
        try {
            String startStr = start.format(DateTimeFormatter.ISO_LOCAL_DATE);
            String endStr = end.format(DateTimeFormatter.ISO_LOCAL_DATE);
            String url = String.format("%s/fixtures/between/%s/%s?api_token=%s&include=participants;league;scores",
                    config.getBaseUrl(), startStr, endStr, config.getApiToken());

            log.info("Fetching fixtures from Sportmonks: {}", url.replace(config.getApiToken(), "***TOKEN***"));

            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/json");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<SportmonksResponse<SportmonksFixture>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<SportmonksResponse<SportmonksFixture>>() {}
            );

            if (response.getBody() != null && response.getBody().getData() != null) {
                List<SportmonksFixture> fixtures = response.getBody().getData();
                log.info("Fetched {} fixtures between {} and {} from Sportmonks", fixtures.size(), startStr, endStr);
                return fixtures;
            }

            log.warn("Empty response from Sportmonks for range {} - {}", startStr, endStr);
            return Collections.emptyList();
        } catch (Exception e) {
            log.error("Error fetching fixtures from Sportmonks for range {} - {}: {}", start, end, e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    public List<SportmonksFixture> getPastFixtures(int days) {
        return getFixturesBetween(LocalDate.now().minusDays(days), LocalDate.now());
    }
}
