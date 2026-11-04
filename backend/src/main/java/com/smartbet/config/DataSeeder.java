package com.smartbet.config;

import com.smartbet.entity.Category;
import com.smartbet.entity.Prediction;
import com.smartbet.entity.Prediction.PredictionStatus;
import com.smartbet.entity.SubscriptionPlan;
import com.smartbet.repository.CategoryRepository;
import com.smartbet.repository.PredictionRepository;
import com.smartbet.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final PredictionRepository predictionRepository;
    private final SubscriptionPlanRepository planRepository;

    @Override
    public void run(String... args) {
        seedCategories();
        seedSubscriptionPlans();
        seedPredictions();
    }

    private void seedCategories() {
        if (categoryRepository.count() > 0) return;

        List<Category> categories = List.of(
            Category.builder().name("Best Tips of the Day").type(Category.CategoryType.FREE).build(),
            Category.builder().name("Safe Picks").type(Category.CategoryType.FREE).build(),
            Category.builder().name("Over / Under Tips").type(Category.CategoryType.FREE).build(),
            Category.builder().name("Single Games").type(Category.CategoryType.FREE).build(),
            Category.builder().name("Football Combines").type(Category.CategoryType.FREE).build(),
            Category.builder().name("Basketball Tips").type(Category.CategoryType.FREE).build(),
            Category.builder().name("Tennis Tips").type(Category.CategoryType.FREE).build(),
            Category.builder().name("Elite VIP").type(Category.CategoryType.VIP).build(),
            Category.builder().name("Fixed VIP").type(Category.CategoryType.VIP).build(),
            Category.builder().name("Single VIP").type(Category.CategoryType.VIP).build(),
            Category.builder().name("Correct Score VIP").type(Category.CategoryType.VIP).build(),
            Category.builder().name("HT/FT VIP").type(Category.CategoryType.VIP).build(),
            Category.builder().name("Special VIP").type(Category.CategoryType.VIP).build(),
            Category.builder().name("Big Odds VIP").type(Category.CategoryType.VIP).build()
        );

        categoryRepository.saveAll(categories);
        log.info("Seeded {} categories", categories.size());
    }

    private void seedSubscriptionPlans() {
        if (planRepository.count() > 0) return;

        List<SubscriptionPlan> plans = List.of(
            SubscriptionPlan.builder()
                .name("Weekly")
                .price(new BigDecimal("5.99"))
                .durationDays(7)
                .description("Perfect for trying out VIP tips")
                .isPopular(false)
                .badge(null)
                .build(),
            SubscriptionPlan.builder()
                .name("Monthly")
                .price(new BigDecimal("14.99"))
                .durationDays(30)
                .description("Best value for serious tipsters")
                .isPopular(true)
                .badge("POPULAR")
                .build(),
            SubscriptionPlan.builder()
                .name("Yearly")
                .price(new BigDecimal("89.99"))
                .durationDays(365)
                .description("Save 50% — Best long-term deal")
                .isPopular(false)
                .badge("SAVE 50%")
                .build()
        );

        planRepository.saveAll(plans);
        log.info("Seeded {} subscription plans", plans.size());
    }

    private void seedPredictions() {
        if (predictionRepository.count() > 0) return;

        Category best = categoryRepository.findByType(Category.CategoryType.FREE).get(0);
        Category safe = categoryRepository.findByType(Category.CategoryType.FREE).get(1);
        Category overUnder = categoryRepository.findByType(Category.CategoryType.FREE).get(2);
        Category single = categoryRepository.findByType(Category.CategoryType.FREE).get(3);
        Category combines = categoryRepository.findByType(Category.CategoryType.FREE).get(4);
        Category basketball = categoryRepository.findByType(Category.CategoryType.FREE).get(5);
        Category tennis = categoryRepository.findByType(Category.CategoryType.FREE).get(6);

        Category eliteVip = categoryRepository.findByType(Category.CategoryType.VIP).get(0);
        Category correctScore = categoryRepository.findByType(Category.CategoryType.VIP).get(3);
        Category htFt = categoryRepository.findByType(Category.CategoryType.VIP).get(4);
        Category bigOdds = categoryRepository.findByType(Category.CategoryType.VIP).get(6);

        LocalDateTime today = LocalDateTime.now();

        List<Prediction> predictions = List.of(
            Prediction.builder()
                .homeTeam("Manchester City").awayTeam("Arsenal").league("Premier League")
                .country("England").matchTime(today.withHour(20).withMinute(45))
                .prediction("Both Teams to Score").odds(1.75).confidence(82)
                .category(best).isVip(false).status(PredictionStatus.PENDING)
                .analysis("Both sides have been in excellent scoring form. Man City have scored in each of their last 9 home games, while Arsenal have netted in their last 7 away fixtures.")
                .build(),
            Prediction.builder()
                .homeTeam("Real Madrid").awayTeam("Atletico Madrid").league("La Liga")
                .country("Spain").matchTime(today.withHour(18).withMinute(0))
                .prediction("Real Madrid Win").odds(1.85).confidence(75)
                .category(safe).isVip(false).status(PredictionStatus.PENDING)
                .analysis("Real Madrid are unbeaten in their last 8 home games. Atletico have struggled away from home this season.")
                .build(),
            Prediction.builder()
                .homeTeam("Bayern Munich").awayTeam("Borussia Dortmund").league("Bundesliga")
                .country("Germany").matchTime(today.withHour(15).withMinute(30))
                .prediction("Over 2.5 Goals").odds(1.55).confidence(88)
                .category(overUnder).isVip(false).status(PredictionStatus.PENDING)
                .analysis("The Klassiker historically produces goals. Both teams average over 2.8 goals per game this season.")
                .build(),
            Prediction.builder()
                .homeTeam("PSG").awayTeam("Marseille").league("Ligue 1")
                .country("France").matchTime(today.withHour(21).withMinute(0))
                .prediction("PSG Win & Over 2.5").odds(2.10).confidence(71)
                .category(combines).isVip(false).status(PredictionStatus.WON)
                .analysis("Le Classique is always fiery. PSG are unbeaten in their last 12 Ligue 1 fixtures.")
                .build(),
            Prediction.builder()
                .homeTeam("Inter Milan").awayTeam("AC Milan").league("Serie A")
                .country("Italy").matchTime(today.withHour(17).withMinute(45))
                .prediction("Under 2.5 Goals").odds(1.90).confidence(68)
                .category(single).isVip(false).status(PredictionStatus.PENDING)
                .analysis("Derby della Madonnina tends to be tight and tactical. The last 4 meetings have produced under 2.5 goals.")
                .build(),
            Prediction.builder()
                .homeTeam("LA Lakers").awayTeam("Golden State Warriors").league("NBA")
                .country("USA").matchTime(today.plusDays(1).withHour(2).withMinute(30))
                .prediction("Lakers Win").odds(2.25).confidence(65)
                .category(basketball).isVip(false).status(PredictionStatus.PENDING)
                .analysis("LeBron James is back in form with three consecutive double-doubles.")
                .build(),
            Prediction.builder()
                .homeTeam("Novak Djokovic").awayTeam("Carlos Alcaraz").league("ATP Masters")
                .country("International").matchTime(today.withHour(14).withMinute(0))
                .prediction("Over 3.5 Sets").odds(2.40).confidence(72)
                .category(tennis).isVip(false).status(PredictionStatus.PENDING)
                .analysis("These two have gone the distance in each of their last 4 meetings.")
                .build(),
            Prediction.builder()
                .homeTeam("Liverpool").awayTeam("Chelsea").league("Premier League")
                .country("England").matchTime(today.withHour(12).withMinute(30))
                .prediction("Liverpool Win").odds(1.70).confidence(79)
                .category(best).isVip(false).status(PredictionStatus.LOST)
                .analysis("Liverpool's Anfield fortress has been impenetrable this season.")
                .build(),
            // VIP predictions
            Prediction.builder()
                .homeTeam("Barcelona").awayTeam("Real Betis").league("La Liga")
                .country("Spain").matchTime(today.withHour(16).withMinute(15))
                .prediction("2-1").odds(7.50).confidence(91)
                .category(correctScore).isVip(true).status(PredictionStatus.PENDING)
                .analysis("Premium VIP analysis — detailed statistical model predicts 2-1 based on recent head-to-head and form data.")
                .build(),
            Prediction.builder()
                .homeTeam("Juventus").awayTeam("Napoli").league("Serie A")
                .country("Italy").matchTime(today.withHour(19).withMinute(45))
                .prediction("HT Draw / FT Home Win").odds(4.20).confidence(87)
                .category(htFt).isVip(true).status(PredictionStatus.PENDING)
                .analysis("Premium VIP HT/FT analysis. Juventus have won from a halftime draw in 4 of their last 6 home games.")
                .build(),
            Prediction.builder()
                .homeTeam("Man United").awayTeam("Tottenham").league("Premier League")
                .country("England").matchTime(today.withHour(17).withMinute(30))
                .prediction("Double Chance + BTTS").odds(12.50).confidence(93)
                .category(bigOdds).isVip(true).status(PredictionStatus.WON)
                .analysis("Premium Big Odds VIP pick. High-value accumulator based on current form and statistical trends.")
                .build(),
            Prediction.builder()
                .homeTeam("Sevilla").awayTeam("Valencia").league("La Liga")
                .country("Spain").matchTime(today.withHour(22).withMinute(0))
                .prediction("Elite Banker Bet").odds(3.80).confidence(95)
                .category(eliteVip).isVip(true).status(PredictionStatus.PENDING)
                .analysis("Elite VIP banker — highest confidence selection of the day based on our premium analytical model.")
                .build()
        );

        predictionRepository.saveAll(predictions);
        log.info("Seeded {} predictions", predictions.size());
    }
}
