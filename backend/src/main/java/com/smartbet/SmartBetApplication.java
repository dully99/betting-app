package com.smartbet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmartBetApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartBetApplication.class, args);
    }
}
