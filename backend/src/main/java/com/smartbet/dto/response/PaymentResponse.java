package com.smartbet.dto.response;

import com.smartbet.entity.Payment;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {

    private Long id;
    private String phoneNumber;
    private BigDecimal amount;
    private String paymentMethod;
    private String status;
    private String transactionReference;
    private String planName;
    private LocalDateTime createdAt;

    public static PaymentResponse from(Payment p) {
        return PaymentResponse.builder()
                .id(p.getId())
                .phoneNumber(p.getPhoneNumber())
                .amount(p.getAmount())
                .paymentMethod(p.getPaymentMethod().name())
                .status(p.getStatus().name())
                .transactionReference(p.getTransactionReference())
                .planName(p.getPlan() != null ? p.getPlan().getName() : null)
                .createdAt(p.getCreatedAt())
                .build();
    }
}
