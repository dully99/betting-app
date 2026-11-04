package com.smartbet.service;

import com.smartbet.dto.request.PaymentRequest;
import com.smartbet.dto.request.PaymentVerifyRequest;
import com.smartbet.dto.response.PaymentResponse;
import com.smartbet.entity.Payment;
import com.smartbet.entity.Payment.PaymentMethod;
import com.smartbet.entity.Payment.PaymentStatus;
import com.smartbet.entity.SubscriptionPlan;
import com.smartbet.repository.PaymentRepository;
import com.smartbet.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final SubscriptionPlanRepository planRepository;

    public PaymentResponse initiatePayment(PaymentRequest request) {
        SubscriptionPlan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new RuntimeException("Subscription plan not found with id: " + request.getPlanId()));

        PaymentMethod method;
        try {
            method = PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid payment method: " + request.getPaymentMethod());
        }

        String transactionRef = generateTransactionReference(method);

        Payment payment = Payment.builder()
                .phoneNumber(request.getPhoneNumber())
                .amount(plan.getPrice())
                .paymentMethod(method)
                .status(PaymentStatus.PENDING)
                .transactionReference(transactionRef)
                .plan(plan)
                .build();

        Payment saved = paymentRepository.save(payment);

        return PaymentResponse.from(saved);
    }

    public PaymentResponse verifyPayment(PaymentVerifyRequest request) {
        Payment payment = paymentRepository.findByTransactionReference(request.getTransactionReference())
                .orElseThrow(() -> new RuntimeException(
                        "Payment not found for reference: " + request.getTransactionReference()));

        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            return PaymentResponse.from(payment);
        }

        // Simulate verification — in production, call mobile money provider API
        payment.setStatus(PaymentStatus.COMPLETED);
        Payment updated = paymentRepository.save(payment);

        return PaymentResponse.from(updated);
    }

    private String generateTransactionReference(PaymentMethod method) {
        String prefix = switch (method) {
            case MPESA -> "MPE";
            case AIRTEL_MONEY -> "AIR";
            case TIGO_PESA -> "TIG";
            case CARD -> "CRD";
        };
        return prefix + "-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
    }
}
