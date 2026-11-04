package com.smartbet.service;

import com.smartbet.dto.response.SubscriptionPlanResponse;
import com.smartbet.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionPlanService {

    private final SubscriptionPlanRepository planRepository;

    public List<SubscriptionPlanResponse> getAllPlans() {
        return planRepository.findAll()
                .stream()
                .map(SubscriptionPlanResponse::from)
                .collect(Collectors.toList());
    }
}
