package com.progile.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record TrackingDto(
        Long id,
        @NotNull Long transportId,
        Long routeId,
        @Min(-90) @Max(90) double latitude,
        @Min(-180) @Max(180) double longitude,
        @Min(0) @Max(160) int speed,
        Instant timestamp
) {
}
