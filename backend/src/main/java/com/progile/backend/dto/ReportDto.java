package com.progile.backend.dto;

import java.time.Instant;

public record ReportDto(
        Long id,
        Long routeId,
        String title,
        int distanceKm,
        int averageSpeed,
        int stops,
        int deviations,
        Instant generatedAt
) {
}
