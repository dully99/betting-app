package com.smartbet.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "football.provider")
@Getter
@Setter
public class FootballProviderConfig {
    private Api api = new Api();
    private Sync sync = new Sync();

    @Getter
    @Setter
    public static class Api {
        private String url;
        private String key;
        private String host;
    }

    @Getter
    @Setter
    public static class Sync {
        private boolean enabled;
        private String cron;
    }
}
