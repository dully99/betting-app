package com.smartbet.dto.response;

import com.smartbet.entity.SubscriptionPlan;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionPlanResponse {

    private Long id;
    private String name;
    private BigDecimal price;
    private Integer durationDays;
    private String description;
    private Boolean isPopular;
    private String badge;

    public static SubscriptionPlanResponse from(SubscriptionPlan sp) {
        return SubscriptionPlanResponse.builder()
                .id(sp.getId())
                .name(sp.getName())
                .price(sp.getPrice())
                .durationDays(sp.getDurationDays())
                .description(sp.getDescription())
                .isPopular(sp.getIsPopular())
                .badge(sp.getBadge())
                .build();
    }
}
