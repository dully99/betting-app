package com.smartbet.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "sportmonks")
@Getter
@Setter
public class SportmonksConfig {
    private String baseUrl;
    private String apiToken;
    private Sync sync = new Sync();

    @Getter
    @Setter
    public static class Sync {
        private boolean enabled;
        private String morningCron;
        private String eveningCron;
        private String resultsCron;
    }
}
