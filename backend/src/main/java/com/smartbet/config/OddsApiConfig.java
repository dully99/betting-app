package com.smartbet.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "odds-api")
@Getter
@Setter
public class OddsApiConfig {
    private String baseUrl = "https://api.the-odds-api.com/v4";
    private String apiKey;
    private String regions = "eu";
}
