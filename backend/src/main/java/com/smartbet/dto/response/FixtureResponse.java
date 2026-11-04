package com.smartbet.dto.response;

import com.smartbet.dto.sportmonks.SportmonksFixture;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FixtureResponse {
    private Long id;
    private String providerFixtureId;
    private String homeTeam;
    private String awayTeam;
    private String league;
    private String country;
    private String startingAt;
    private String state;

    public static FixtureResponse from(SportmonksFixture f) {
        String home = "Unknown";
        String away = "Unknown";
        if (f.getParticipants() != null) {
            for (SportmonksFixture.Participant p : f.getParticipants()) {
                if (p.getMeta() == null || p.getMeta().getLocation() == null) continue;
                if ("home".equalsIgnoreCase(p.getMeta().getLocation())) home = p.getName();
                else if ("away".equalsIgnoreCase(p.getMeta().getLocation())) away = p.getName();
            }
        }
        return FixtureResponse.builder()
                .id(f.getId())
                .providerFixtureId("sportmonks_" + f.getId())
                .homeTeam(home)
                .awayTeam(away)
                .league(f.getLeague() != null ? f.getLeague().getName() : "Unknown")
                .country(f.getLeague() != null && f.getLeague().getCountry() != null
                        ? f.getLeague().getCountry().getName() : "Unknown")
                .startingAt(f.getStartingAt())
                .state(f.getState() != null ? f.getState().getState() : null)
                .build();
    }
}
