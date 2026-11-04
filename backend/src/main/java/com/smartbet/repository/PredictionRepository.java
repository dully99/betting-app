package com.smartbet.repository;

import com.smartbet.entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    List<Prediction> findByIsVipFalseAndStatusOrderByMatchTimeAsc(Prediction.PredictionStatus status);
    List<Prediction> findByIsVipTrueAndStatusOrderByMatchTimeAsc(Prediction.PredictionStatus status);
    List<Prediction> findByStatusInOrderByMatchTimeDesc(List<Prediction.PredictionStatus> statuses);
    List<Prediction> findByCategoryIdOrderByMatchTimeAsc(Long categoryId);
    Optional<Prediction> findByProviderFixtureId(String providerFixtureId);
    boolean existsByProviderFixtureId(String providerFixtureId);
}
