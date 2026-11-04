package com.smartbet.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "football-data")
@Getter
@Setter
public class FootballDataConfig {
    private String baseUrl = "https://api.football-data.org/v4";
    private String apiToken;
}
