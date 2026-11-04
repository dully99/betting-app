package com.smartbet.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;

@Service
public class AuthTokenService {

    @Value("${app.auth.secret:change-me-in-production}")
    private String secret;

    @Value("${app.auth.token-ttl-hours:24}")
    private long ttlHours;

    public String issueToken(String username) {
        long expiry = Instant.now().plusSeconds(ttlHours * 3600).getEpochSecond();
        String payload = username + "|" + expiry;
        String signature = sign(payload);
        return Base64.getUrlEncoder().withoutPadding()
                .encodeToString((payload + "|" + signature).getBytes(StandardCharsets.UTF_8));
    }

    public String validate(String token) {
        try {
            String decoded = new String(Base64.getUrlDecoder().decode(token), StandardCharsets.UTF_8);
            String[] parts = decoded.split("\\|");
            if (parts.length != 3) {
                return null;
            }
            String payload = parts[0] + "|" + parts[1];
            if (!sign(payload).equals(parts[2])) {
                return null;
            }
            if (Long.parseLong(parts[1]) < Instant.now().getEpochSecond()) {
                return null;
            }
            return parts[0];
        } catch (Exception e) {
            return null;
        }
    }

    private String sign(String payload) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }
}
