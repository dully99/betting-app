package com.smartbet.controller;

import com.smartbet.dto.request.PaymentRequest;
import com.smartbet.dto.request.PaymentVerifyRequest;
import com.smartbet.dto.response.ApiResponse;
import com.smartbet.dto.response.PaymentResponse;
import com.smartbet.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/initiate")
    public ResponseEntity<ApiResponse<PaymentResponse>> initiatePayment(
            @Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.initiatePayment(request);
        return ResponseEntity.ok(ApiResponse.ok(
                "Payment initiated. A prompt will be sent to " + request.getPhoneNumber(), response));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<PaymentResponse>> verifyPayment(
            @Valid @RequestBody PaymentVerifyRequest request) {
        PaymentResponse response = paymentService.verifyPayment(request);
        return ResponseEntity.ok(ApiResponse.ok("Payment verified successfully", response));
    }
}
