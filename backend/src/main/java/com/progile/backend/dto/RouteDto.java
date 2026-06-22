package com.progile.backend.dto;

import com.progile.backend.model.RouteStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RouteDto(
        Long id,
        @NotBlank String name,
        @NotBlank String startPoint,
        @NotBlank String endPoint,
        @NotNull RouteStatus status,
        Long vehicleId,
        @NotBlank String eta,
        @Min(0) @Max(100) int progress
) {
}
