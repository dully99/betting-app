package com.smartbet.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String homeTeam;

    @Column(nullable = false)
    private String awayTeam;

    @Column(nullable = false)
    private String league;

    @Column(nullable = false)
    private String country;

    @Column(nullable = false)
    private LocalDateTime matchTime;

    @Column(nullable = false)
    private String prediction;

    private String predictionType;

    private String predictionValue;

    @Column(nullable = false)
    private Double odds;

    @Column(nullable = false)
    private Integer confidence;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private Boolean isVip;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PredictionStatus status;

    @Column(columnDefinition = "TEXT")
    private String analysis;

    @Column(unique = true)
    private String providerFixtureId;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum PredictionStatus {
        REVIEW, PENDING, WON, LOST, REJECTED
    }
}
