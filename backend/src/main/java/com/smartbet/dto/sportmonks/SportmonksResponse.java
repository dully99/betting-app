package com.smartbet.dto.sportmonks;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SportmonksResponse<T> {
    private List<T> data;
    private Pagination pagination;
    private Subscription subscription;
    private RateLimit rateLimit;
    private String timezone;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Pagination {
        private Integer count;
        private Integer perPage;
        private Integer currentPage;
        private Integer nextPage;
        private Boolean hasMore;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Subscription {
        private List<String> meta;
        private List<String> plans;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RateLimit {
        private Integer resetsInSeconds;
        private Integer remaining;
        private String requestedEntity;
    }
}
