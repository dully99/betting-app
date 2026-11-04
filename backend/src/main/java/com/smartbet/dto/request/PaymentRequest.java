package com.smartbet.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[0-9]{9,13}$", message = "Invalid phone number format")
    private String phoneNumber;

    @NotNull(message = "Plan ID is required")
    private Long planId;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;
}
