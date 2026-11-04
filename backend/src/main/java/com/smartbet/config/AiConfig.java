package com.smartbet.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "ai")
@Getter
@Setter
public class AiConfig {
    private boolean enabled;
    private String provider = "anthropic";
    private String apiKey;
    private String model = "claude-sonnet-4-20250514";
    private String baseUrl = "https://api.anthropic.com/v1/messages";
}
