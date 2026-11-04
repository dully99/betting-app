package com.smartbet.scheduler;

import com.smartbet.config.SportmonksConfig;
import com.smartbet.service.PredictionSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "sportmonks.sync.enabled", havingValue = "true")
public class PredictionSyncScheduler {

    private final PredictionSyncService syncService;
    private final SportmonksConfig config;

    // Morning sync at 6:00 AM - Fetch today's predictions
    @Scheduled(cron = "${sportmonks.sync.morning-cron}")
    public void syncMorningPredictions() {
        if (!config.getSync().isEnabled()) {
            log.debug("Prediction sync is disabled");
            return;
        }

        log.info("Starting morning prediction sync (6 AM)...");
        try {
            int todayCount = syncService.syncTodayPredictions();
            log.info("Morning sync completed. Today's predictions: {}", todayCount);
        } catch (Exception e) {
            log.error("Error during morning sync: {}", e.getMessage(), e);
        }
    }

    // Evening sync at 8:00 PM - Fetch tomorrow's predictions
    @Scheduled(cron = "${sportmonks.sync.evening-cron}")
    public void syncEveningPredictions() {
        if (!config.getSync().isEnabled()) {
            log.debug("Prediction sync is disabled");
            return;
        }

        log.info("Starting evening prediction sync (8 PM)...");
        try {
            int tomorrowCount = syncService.syncTomorrowPredictions();
            log.info("Evening sync completed. Tomorrow's predictions: {}", tomorrowCount);
        } catch (Exception e) {
            log.error("Error during evening sync: {}", e.getMessage(), e);
        }
    }

    // Hourly results sync - settle finished matches as WON/LOST
    @Scheduled(cron = "${sportmonks.sync.results-cron}")
    public void syncResults() {
        if (!config.getSync().isEnabled()) {
            log.debug("Prediction sync is disabled");
            return;
        }

        log.info("Starting results sync...");
        try {
            int settled = syncService.syncResults(3);
            log.info("Results sync completed. {} predictions settled", settled);
        } catch (Exception e) {
            log.error("Error during results sync: {}", e.getMessage(), e);
        }
    }
}
